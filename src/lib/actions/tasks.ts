"use server"

import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { tasks, facilities, contacts, deals, type NewTask, type Task } from "@/lib/db/schema"
import { eq, desc, and, isNull, lte } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type TaskWithRelations = Task & {
  facility: { id: string; name: string } | null
  contact: { id: string; name: string } | null
  deal: { id: string; name: string } | null
}

export const TASK_TYPES = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "demo", label: "Demo" },
  { value: "follow_up", label: "Follow-up" },
  { value: "other", label: "Other" },
] as const

export const PRIORITIES = [
  { value: "high", label: "High", color: "destructive" },
  { value: "medium", label: "Medium", color: "warning" },
  { value: "low", label: "Low", color: "secondary" },
] as const

export async function getTasks(): Promise<TaskWithRelations[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db
    .select({
      task: tasks,
      facility: {
        id: facilities.id,
        name: facilities.name,
      },
      contact: {
        id: contacts.id,
        name: contacts.name,
      },
      deal: {
        id: deals.id,
        name: deals.name,
      },
    })
    .from(tasks)
    .leftJoin(facilities, eq(tasks.facilityId, facilities.id))
    .leftJoin(contacts, eq(tasks.contactId, contacts.id))
    .leftJoin(deals, eq(tasks.dealId, deals.id))
    .where(eq(tasks.userId, user.id))
    .orderBy(desc(tasks.dueAt))

  return result.map((r) => ({
    ...r.task,
    facility: r.facility,
    contact: r.contact,
    deal: r.deal,
  }))
}

export async function getOpenTasks(): Promise<TaskWithRelations[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db
    .select({
      task: tasks,
      facility: {
        id: facilities.id,
        name: facilities.name,
      },
      contact: {
        id: contacts.id,
        name: contacts.name,
      },
      deal: {
        id: deals.id,
        name: deals.name,
      },
    })
    .from(tasks)
    .leftJoin(facilities, eq(tasks.facilityId, facilities.id))
    .leftJoin(contacts, eq(tasks.contactId, contacts.id))
    .leftJoin(deals, eq(tasks.dealId, deals.id))
    .where(and(eq(tasks.userId, user.id), isNull(tasks.completedAt)))
    .orderBy(tasks.dueAt)

  return result.map((r) => ({
    ...r.task,
    facility: r.facility,
    contact: r.contact,
    deal: r.deal,
  }))
}

export async function getTodaysTasks(): Promise<TaskWithRelations[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const result = await db
    .select({
      task: tasks,
      facility: {
        id: facilities.id,
        name: facilities.name,
      },
      contact: {
        id: contacts.id,
        name: contacts.name,
      },
      deal: {
        id: deals.id,
        name: deals.name,
      },
    })
    .from(tasks)
    .leftJoin(facilities, eq(tasks.facilityId, facilities.id))
    .leftJoin(contacts, eq(tasks.contactId, contacts.id))
    .leftJoin(deals, eq(tasks.dealId, deals.id))
    .where(and(
      eq(tasks.userId, user.id),
      isNull(tasks.completedAt),
      lte(tasks.dueAt, today)
    ))
    .orderBy(tasks.dueAt)

  return result.map((r) => ({
    ...r.task,
    facility: r.facility,
    contact: r.contact,
    deal: r.deal,
  }))
}

export async function getTask(id: string): Promise<Task | undefined> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1)
  return result[0]
}

export async function createTask(data: Omit<NewTask, "userId" | "createdAt" | "updatedAt">): Promise<Task> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db.insert(tasks).values({
    ...data,
    userId: user.id,
  }).returning()

  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  return result[0]
}

export async function updateTask(id: string, data: Partial<Omit<NewTask, "userId" | "createdAt" | "updatedAt">>): Promise<Task> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db.update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning()

  revalidatePath("/tasks")
  revalidatePath("/dashboard")
  return result[0]
}

export async function completeTask(id: string): Promise<Task> {
  return updateTask(id, { completedAt: new Date() })
}

export async function reopenTask(id: string): Promise<Task> {
  return updateTask(id, { completedAt: null })
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.delete(tasks).where(eq(tasks.id, id))
  revalidatePath("/tasks")
  revalidatePath("/dashboard")
}
