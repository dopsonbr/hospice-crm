import { getDashboardStats, getPipelineByStage } from '@/lib/actions/stats';
import { getTodaysTasks } from '@/lib/actions/tasks';
import { getRecentActivities } from '@/lib/actions/activities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Briefcase,
  Building2,
  CheckSquare,
  TrendingUp,
  Target,
  Phone,
  Mail,
  Users,
  Monitor,
  RefreshCw,
  MoreHorizontal,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const typeIcons: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  meeting: <Users className="h-4 w-4" />,
  demo: <Monitor className="h-4 w-4" />,
  follow_up: <RefreshCw className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
};

const priorityColors: Record<string, 'destructive' | 'warning' | 'secondary'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
};

export default async function DashboardPage() {
  const [stats, pipelineStages, todaysTasks, recentActivities] = await Promise.all([
    getDashboardStats(),
    getPipelineByStage(),
    getTodaysTasks(),
    getRecentActivities(5),
  ]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const maxPipelineValue = Math.max(...pipelineStages.map((s) => s.value), 1);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Dashboard</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
          Your sales pipeline at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-4 lg:mb-8 lg:gap-4">
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 sm:h-12 sm:w-12">
                <DollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {formatCurrency(stats.pipelineValue)}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Pipeline Value
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 sm:h-12 sm:w-12">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {stats.activeDeals}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Active Deals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 sm:h-12 sm:w-12">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {stats.facilitiesCount}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Facilities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 sm:h-12 sm:w-12">
                <CheckSquare className="h-5 w-5 text-orange-600 dark:text-orange-400 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {stats.tasksDueToday}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Tasks Due Today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="mb-6 grid gap-3 grid-cols-2 lg:mb-8 lg:gap-4">
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 sm:h-10 sm:w-10">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-900 dark:text-white sm:text-xl">
                  {formatCurrency(stats.closedThisMonth)}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Closed This Month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 sm:h-10 sm:w-10">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-900 dark:text-white sm:text-xl">
                  {stats.winRate}%
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Win Rate (90 days)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Pipeline Overview */}
        <Card>
          <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="flex items-center justify-between text-base sm:text-lg">
              Pipeline Overview
              <Link
                href="/pipeline"
                className="text-sm font-normal text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 sm:p-6 sm:pt-2">
            {pipelineStages.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-6 sm:py-8">
                No active deals yet.{' '}
                <Link href="/pipeline/new" className="text-teal-600 hover:text-teal-700">
                  Create your first deal
                </Link>
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {pipelineStages.map((stage) => (
                  <div key={stage.stage}>
                    <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {stage.label}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {stage.count} · {formatCurrency(stage.value)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${(stage.value / maxPipelineValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card>
          <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="flex items-center justify-between text-base sm:text-lg">
              Today&apos;s Tasks
              <Link
                href="/tasks"
                className="text-sm font-normal text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 sm:p-6 sm:pt-2">
            {todaysTasks.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-6 sm:py-8">
                No tasks due today.{' '}
                <Link href="/tasks/new" className="text-teal-600 hover:text-teal-700">
                  Create a task
                </Link>
              </p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {todaysTasks.slice(0, 5).map((task) => {
                  const isOverdue = task.dueAt && new Date(task.dueAt) < new Date();
                  return (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 p-2.5 dark:border-slate-700 sm:gap-3 sm:p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate sm:text-base">
                          {task.description}
                        </p>
                        {task.facility && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate sm:text-sm">
                            {task.facility.name}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
                        {task.priority && (
                          <Badge variant={priorityColors[task.priority]} className="text-xs">
                            {task.priority}
                          </Badge>
                        )}
                        {isOverdue && <Clock className="h-3.5 w-3.5 text-red-500 sm:h-4 sm:w-4" />}
                      </div>
                    </div>
                  );
                })}
                {todaysTasks.length > 5 && (
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    +{todaysTasks.length - 5} more tasks
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="flex items-center justify-between text-base sm:text-lg">
              Recent Activity
              <Link
                href="/activities"
                className="text-sm font-normal text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 sm:p-6 sm:pt-2">
            {recentActivities.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-6 sm:py-8">
                No activities logged yet.{' '}
                <Link href="/activities/new" className="text-teal-600 hover:text-teal-700">
                  Log your first activity
                </Link>
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 sm:h-8 sm:w-8">
                      {typeIcons[activity.type] || (
                        <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white sm:text-base">
                        {activity.subject}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 sm:gap-2 sm:text-sm">
                        {activity.facility && (
                          <span className="truncate">{activity.facility.name}</span>
                        )}
                        {activity.facility && <span>•</span>}
                        <span>{new Date(activity.occurredAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
