import { getActiveDeals } from '@/lib/actions/deals';
import { DEAL_STAGES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PipelineBoard } from './pipeline-board';

export default async function PipelinePage() {
  const deals = await getActiveDeals();

  // Group deals by stage
  const dealsByStage = DEAL_STAGES.filter(
    (s) => s.value !== 'closed_won' && s.value !== 'closed_lost'
  ).map((stage) => ({
    ...stage,
    deals: deals.filter((d) => d.stage === stage.value),
  }));

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-800 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Pipeline
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Manage your sales opportunities
            </p>
          </div>
          <Link href="/pipeline/new" className="self-start sm:self-auto">
            <Button size="sm" className="sm:size-default">
              <Plus className="h-4 w-4" />
              New Deal
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto bg-slate-100 p-4 dark:bg-slate-900 sm:p-6">
        <PipelineBoard stages={dealsByStage} />
      </div>
    </div>
  );
}
