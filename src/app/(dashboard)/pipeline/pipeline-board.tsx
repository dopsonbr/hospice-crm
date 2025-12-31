"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { updateDealStage, type DealWithRelations, type DealStage } from "@/lib/actions/deals"
import { MapPin, DollarSign, GripVertical } from "lucide-react"

type StageWithDeals = {
  value: string
  label: string
  probability: number
  deals: DealWithRelations[]
}

export function PipelineBoard({ stages }: { stages: StageWithDeals[] }) {
  const [localStages, setLocalStages] = useState(stages)
  const [draggingDeal, setDraggingDeal] = useState<string | null>(null)

  const handleDragStart = (dealId: string) => {
    setDraggingDeal(dealId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    if (!draggingDeal) return

    // Find the deal
    let deal: DealWithRelations | undefined
    for (const stage of localStages) {
      deal = stage.deals.find((d) => d.id === draggingDeal)
      if (deal) break
    }

    if (!deal || deal.stage === targetStage) {
      setDraggingDeal(null)
      return
    }

    // Optimistically update local state
    setLocalStages((prevStages) =>
      prevStages.map((stage) => ({
        ...stage,
        deals:
          stage.value === targetStage
            ? [...stage.deals, { ...deal!, stage: targetStage }]
            : stage.deals.filter((d) => d.id !== draggingDeal),
      }))
    )

    setDraggingDeal(null)

    // Update on server
    try {
      await updateDealStage(draggingDeal, targetStage as DealStage)
    } catch (error) {
      console.error("Failed to update deal stage:", error)
      // Revert on error
      setLocalStages(stages)
    }
  }

  const formatCurrency = (value: string | null) => {
    if (!value) return null
    const num = Number(value)
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
    return `$${num.toLocaleString()}`
  }

  const calculateStageValue = (deals: DealWithRelations[]) => {
    return deals.reduce((sum, deal) => sum + Number(deal.value ?? 0), 0)
  }

  return (
    <div className="flex gap-4" style={{ minWidth: `${stages.length * 300}px` }}>
      {localStages.map((stage) => (
        <div
          key={stage.value}
          className="w-72 flex-shrink-0"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage.value)}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {stage.label}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {stage.deals.length}
              </Badge>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {formatCurrency(String(calculateStageValue(stage.deals))) || "$0"}
            </span>
          </div>

          <div className="space-y-3">
            {stage.deals.map((deal) => (
              <Card
                key={deal.id}
                draggable
                onDragStart={() => handleDragStart(deal.id)}
                className={`cursor-grab bg-white transition-all hover:shadow-md dark:bg-slate-800 ${
                  draggingDeal === deal.id ? "opacity-50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <Link
                      href={`/pipeline/${deal.id}`}
                      className="font-medium text-slate-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                    >
                      {deal.name}
                    </Link>
                    <GripVertical className="h-4 w-4 text-slate-400" />
                  </div>

                  {deal.facility && (
                    <div className="mb-2 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {deal.facility.city && deal.facility.state
                          ? `${deal.facility.city}, ${deal.facility.state}`
                          : deal.facility.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {deal.value && (
                      <div className="flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-white">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(deal.value)}
                      </div>
                    )}
                    {deal.nextStep && (
                      <span className="max-w-32 truncate text-xs text-slate-500 dark:text-slate-400">
                        {deal.nextStep}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {stage.deals.length === 0 && (
              <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-400 dark:border-slate-700">
                Drop deals here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
