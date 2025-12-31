import { getOpenTasks, completeTask } from "@/lib/actions/tasks"
import { TASK_TYPES, PRIORITIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, CheckCircle2, Circle, Clock, Building2, User, Briefcase } from "lucide-react"
import Link from "next/link"
import { revalidatePath } from "next/cache"

const priorityColors: Record<string, "destructive" | "warning" | "secondary"> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
}

const typeIcons: Record<string, string> = {
  call: "Phone",
  email: "Mail",
  meeting: "Users",
  demo: "Monitor",
  follow_up: "RefreshCw",
  other: "MoreHorizontal",
}

export default async function TasksPage() {
  const tasks = await getOpenTasks()

  const overdueTasks = tasks.filter((t) => {
    if (!t.dueAt) return false
    return new Date(t.dueAt) < new Date()
  })

  const todayTasks = tasks.filter((t) => {
    if (!t.dueAt) return false
    const due = new Date(t.dueAt)
    const today = new Date()
    return (
      due.toDateString() === today.toDateString() &&
      !overdueTasks.includes(t)
    )
  })

  const upcomingTasks = tasks.filter(
    (t) => !overdueTasks.includes(t) && !todayTasks.includes(t)
  )

  async function handleComplete(taskId: string) {
    "use server"
    await completeTask(taskId)
    revalidatePath("/tasks")
  }

  const TaskItem = ({ task }: { task: typeof tasks[0] }) => {
    const taskType = TASK_TYPES.find((t) => t.value === task.type)
    const priority = PRIORITIES.find((p) => p.value === task.priority)
    const isOverdue = task.dueAt && new Date(task.dueAt) < new Date()

    return (
      <Card key={task.id} className="bg-white dark:bg-slate-800">
        <CardContent className="flex items-start gap-4 p-4">
          <form action={handleComplete.bind(null, task.id)}>
            <button
              type="submit"
              className="mt-0.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
            >
              <Circle className="h-5 w-5" />
            </button>
          </form>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {task.description}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  {taskType && (
                    <span className="flex items-center gap-1">
                      {taskType.label}
                    </span>
                  )}
                  {task.facility && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <Link
                        href={`/facilities/${task.facility.id}`}
                        className="hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        {task.facility.name}
                      </Link>
                    </span>
                  )}
                  {task.contact && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <Link
                        href={`/contacts/${task.contact.id}`}
                        className="hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        {task.contact.name}
                      </Link>
                    </span>
                  )}
                  {task.deal && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      <Link
                        href={`/pipeline/${task.deal.id}`}
                        className="hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        {task.deal.name}
                      </Link>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                {priority && (
                  <Badge variant={priorityColors[priority.value]}>
                    {priority.label}
                  </Badge>
                )}
                {task.dueAt && (
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      isOverdue
                        ? "text-red-600 dark:text-red-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {new Date(task.dueAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Stay on top of your follow-ups and to-dos
          </p>
        </div>
        <Link href="/tasks/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-teal-600" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            All caught up!
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            You have no open tasks. Great job!
          </p>
          <Link href="/tasks/new">
            <Button className="mt-4">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-8">
          {overdueTasks.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-600 dark:text-red-400">
                <Clock className="h-5 w-5" />
                Overdue ({overdueTasks.length})
              </h2>
              <div className="space-y-3">
                {overdueTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {todayTasks.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                Today ({todayTasks.length})
              </h2>
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {upcomingTasks.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                Upcoming ({upcomingTasks.length})
              </h2>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
