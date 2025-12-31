import { notFound } from "next/navigation"
import Link from "next/link"
import { getDeal, deleteDeal } from "@/lib/actions/deals"
import { DEAL_STAGES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Building2, User, DollarSign, Calendar, Target } from "lucide-react"
import { redirect } from "next/navigation"

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const deal = await getDeal(id)

  if (!deal) {
    notFound()
  }

  const stage = DEAL_STAGES.find((s) => s.value === deal.stage)

  async function handleDelete() {
    "use server"
    await deleteDeal(id)
    redirect("/pipeline")
  }

  const formatCurrency = (value: string | null) => {
    if (!value) return "-"
    return `$${Number(value).toLocaleString()}`
  }

  const getStageColor = (stageName: string) => {
    const colors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
      lead: "secondary",
      discovery: "secondary",
      demo_scheduled: "warning",
      demo_completed: "warning",
      proposal_sent: "default",
      negotiation: "default",
      verbal_commit: "success",
      closed_won: "success",
      closed_lost: "destructive",
    }
    return colors[stageName] ?? "secondary"
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/pipeline"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pipeline
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {deal.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Badge variant={getStageColor(deal.stage)}>
                {stage?.label ?? deal.stage}
              </Badge>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {stage?.probability ?? 0}% probability
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/pipeline/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <form action={handleDelete}>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(deal.value)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Deal Value</div>
              </div>
              {deal.recurringValue && (
                <div>
                  <div className="text-xl font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(deal.recurringValue)}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Annual Recurring
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Expected Close
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {deal.expectedCloseDate
                    ? new Date(deal.expectedCloseDate).toLocaleDateString()
                    : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Created</dt>
                <dd className="text-slate-900 dark:text-white">
                  {new Date(deal.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Next Step
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-900 dark:text-white">
              {deal.nextStep ?? "No next step defined"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Facility
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deal.facility ? (
              <Link
                href={`/facilities/${deal.facility.id}`}
                className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                {deal.facility.name}
                {deal.facility.city && deal.facility.state && (
                  <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                    ({deal.facility.city}, {deal.facility.state})
                  </span>
                )}
              </Link>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No facility linked</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Primary Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deal.primaryContact ? (
              <Link
                href={`/contacts/${deal.primaryContact.id}`}
                className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                {deal.primaryContact.name}
              </Link>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">No contact linked</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-900 dark:text-white">
              {deal.competitors ?? "No competitors noted"}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-400">
              {deal.notes ?? "No notes yet."}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href={`/activities?dealId=${id}`}>
                <Button variant="outline" size="sm">
                  Log Activity
                </Button>
              </Link>
              <Link href={`/tasks/new?dealId=${id}`}>
                <Button variant="outline" size="sm">
                  Create Task
                </Button>
              </Link>
              {deal.facility && (
                <Link href={`/facilities/${deal.facility.id}`}>
                  <Button variant="outline" size="sm">
                    View Facility
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
