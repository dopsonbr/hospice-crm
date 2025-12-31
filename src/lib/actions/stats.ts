"use server"

import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { facilities, deals, tasks, activities } from "@/lib/db/schema"
import { eq, count, sum, and, ne, isNull, lte, gte } from "drizzle-orm"

export type DashboardStats = {
  pipelineValue: number
  activeDeals: number
  facilitiesCount: number
  tasksDueToday: number
  closedThisMonth: number
  winRate: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1)

  // Get pipeline value (sum of active deals)
  const pipelineResult = await db
    .select({ total: sum(deals.value) })
    .from(deals)
    .where(and(
      eq(deals.userId, user.id),
      ne(deals.stage, "closed_won"),
      ne(deals.stage, "closed_lost")
    ))

  // Get active deals count
  const activeDealsResult = await db
    .select({ count: count() })
    .from(deals)
    .where(and(
      eq(deals.userId, user.id),
      ne(deals.stage, "closed_won"),
      ne(deals.stage, "closed_lost")
    ))

  // Get facilities count
  const facilitiesResult = await db
    .select({ count: count() })
    .from(facilities)
    .where(eq(facilities.userId, user.id))

  // Get tasks due today or overdue
  const tasksTodayResult = await db
    .select({ count: count() })
    .from(tasks)
    .where(and(
      eq(tasks.userId, user.id),
      isNull(tasks.completedAt),
      lte(tasks.dueAt, today)
    ))

  // Get closed won this month
  const closedThisMonthResult = await db
    .select({ total: sum(deals.value) })
    .from(deals)
    .where(and(
      eq(deals.userId, user.id),
      eq(deals.stage, "closed_won"),
      gte(deals.updatedAt, startOfMonth)
    ))

  // Calculate win rate (last 3 months)
  const closedDealsResult = await db
    .select({
      stage: deals.stage,
      count: count()
    })
    .from(deals)
    .where(and(
      eq(deals.userId, user.id),
      gte(deals.updatedAt, threeMonthsAgo)
    ))
    .groupBy(deals.stage)

  const won = closedDealsResult.find(d => d.stage === "closed_won")?.count ?? 0
  const lost = closedDealsResult.find(d => d.stage === "closed_lost")?.count ?? 0
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0

  return {
    pipelineValue: Number(pipelineResult[0]?.total ?? 0),
    activeDeals: activeDealsResult[0]?.count ?? 0,
    facilitiesCount: facilitiesResult[0]?.count ?? 0,
    tasksDueToday: tasksTodayResult[0]?.count ?? 0,
    closedThisMonth: Number(closedThisMonthResult[0]?.total ?? 0),
    winRate,
  }
}

export type PipelineByStage = {
  stage: string
  label: string
  count: number
  value: number
}

export async function getPipelineByStage(): Promise<PipelineByStage[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db
    .select({
      stage: deals.stage,
      count: count(),
      value: sum(deals.value),
    })
    .from(deals)
    .where(and(
      eq(deals.userId, user.id),
      ne(deals.stage, "closed_won"),
      ne(deals.stage, "closed_lost")
    ))
    .groupBy(deals.stage)

  const stageLabels: Record<string, string> = {
    lead: "Lead",
    discovery: "Discovery",
    demo_scheduled: "Demo Scheduled",
    demo_completed: "Demo Completed",
    proposal_sent: "Proposal Sent",
    negotiation: "Negotiation",
    verbal_commit: "Verbal Commit",
  }

  return result.map(r => ({
    stage: r.stage,
    label: stageLabels[r.stage] ?? r.stage,
    count: r.count,
    value: Number(r.value ?? 0),
  }))
}
