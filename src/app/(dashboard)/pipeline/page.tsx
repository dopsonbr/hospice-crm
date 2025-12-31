import { getActiveDeals, DEAL_STAGES } from "@/lib/actions/deals"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PipelineBoard } from "./pipeline-board"

export default async function PipelinePage() {
  const deals = await getActiveDeals()

  // Group deals by stage
  const dealsByStage = DEAL_STAGES.filter(
    (s) => s.value !== "closed_won" && s.value !== "closed_lost"
  ).map((stage) => ({
    ...stage,
    deals: deals.filter((d) => d.stage === stage.value),
  }))

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-white px-8 py-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pipeline</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your sales opportunities
            </p>
          </div>
          <Link href="/pipeline/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Deal
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto bg-slate-100 p-6 dark:bg-slate-900">
        <PipelineBoard stages={dealsByStage} />
      </div>
    </div>
  )
}
