import { getDashboardStats, getPipelineByStage } from "@/lib/actions/stats"
import { getTodaysTasks } from "@/lib/actions/tasks"
import { getRecentActivities } from "@/lib/actions/activities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"

const typeIcons: Record<string, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  meeting: <Users className="h-4 w-4" />,
  demo: <Monitor className="h-4 w-4" />,
  follow_up: <RefreshCw className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
}

const priorityColors: Record<string, "destructive" | "warning" | "secondary"> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
}

export default async function DashboardPage() {
  const [stats, pipelineStages, todaysTasks, recentActivities] = await Promise.all([
    getDashboardStats(),
    getPipelineByStage(),
    getTodaysTasks(),
    getRecentActivities(5),
  ])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  const maxPipelineValue = Math.max(...pipelineStages.map((s) => s.value), 1)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Your sales pipeline at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                <DollarSign className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(stats.pipelineValue)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pipeline Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.activeDeals}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.facilitiesCount}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Facilities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                <CheckSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.tasksDueToday}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tasks Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(stats.closedThisMonth)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Closed This Month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {stats.winRate}%
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Win Rate (90 days)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pipeline Overview
              <Link
                href="/pipeline"
                className="text-sm font-normal text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineStages.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No active deals yet.{" "}
                <Link href="/pipeline/new" className="text-teal-600 hover:text-teal-700">
                  Create your first deal
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {pipelineStages.map((stage) => (
                  <div key={stage.stage}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {stage.label}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {stage.count} deals · {formatCurrency(stage.value)}
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
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Today&apos;s Tasks
              <Link
                href="/tasks"
                className="text-sm font-normal text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysTasks.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No tasks due today.{" "}
                <Link href="/tasks/new" className="text-teal-600 hover:text-teal-700">
                  Create a task
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {todaysTasks.slice(0, 5).map((task) => {
                  const isOverdue = task.dueAt && new Date(task.dueAt) < new Date()
                  return (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {task.description}
                        </p>
                        {task.facility && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {task.facility.name}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        {task.priority && (
                          <Badge variant={priorityColors[task.priority]}>
                            {task.priority}
                          </Badge>
                        )}
                        {isOverdue && (
                          <Clock className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  )
                })}
                {todaysTasks.length > 5 && (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    +{todaysTasks.length - 5} more tasks
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Link
                href="/activities"
                className="text-sm font-normal text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No activities logged yet.{" "}
                <Link href="/activities/new" className="text-teal-600 hover:text-teal-700">
                  Log your first activity
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {typeIcons[activity.type] || <MoreHorizontal className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {activity.subject}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        {activity.facility && (
                          <span>{activity.facility.name}</span>
                        )}
                        <span>•</span>
                        <span>
                          {new Date(activity.occurredAt).toLocaleDateString()}
                        </span>
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
  )
}
