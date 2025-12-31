import { notFound } from "next/navigation"
import Link from "next/link"
import { getContact, deleteContact } from "@/lib/actions/contacts"
import { getFacility } from "@/lib/actions/facilities"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Trash2, Phone, Mail, MessageSquare, ExternalLink } from "lucide-react"
import { redirect } from "next/navigation"

const buyerRoleLabels: Record<string, string> = {
  decision_maker: "Decision Maker",
  influencer: "Influencer",
  champion: "Champion",
  blocker: "Blocker",
  end_user: "End User",
}

const preferredContactLabels: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  text: "Text",
  in_person: "In-Person",
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const contact = await getContact(id)

  if (!contact) {
    notFound()
  }

  const facility = contact.facilityId ? await getFacility(contact.facilityId) : null

  async function handleDelete() {
    "use server"
    await deleteContact(id)
    redirect("/contacts")
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/contacts"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contacts
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {contact.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {contact.title && (
                <span className="text-slate-600 dark:text-slate-400">{contact.title}</span>
              )}
              {contact.buyerRole && (
                <Badge variant="secondary">
                  {buyerRoleLabels[contact.buyerRole] ?? contact.buyerRole}
                </Badge>
              )}
              {facility && (
                <Link
                  href={`/facilities/${facility.id}`}
                  className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  @ {facility.name}
                </Link>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/contacts/${id}/edit`}>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                >
                  <Mail className="h-5 w-5" />
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                >
                  <Phone className="h-5 w-5" />
                  {contact.phone}
                </a>
              )}
              {contact.mobile && (
                <a
                  href={`tel:${contact.mobile}`}
                  className="flex items-center gap-3 text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                >
                  <MessageSquare className="h-5 w-5" />
                  {contact.mobile} (Mobile)
                </a>
              )}
              {contact.linkedinUrl && (
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                >
                  <ExternalLink className="h-5 w-5" />
                  LinkedIn Profile
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Preferred Contact Method
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {contact.preferredContact
                    ? preferredContactLabels[contact.preferredContact] ?? contact.preferredContact
                    : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Last Contacted
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {contact.lastContactAt
                    ? new Date(contact.lastContactAt).toLocaleDateString()
                    : "Never"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Added
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-400">
              {contact.notes ?? "No notes yet."}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {contact.email && (
                <a href={`mailto:${contact.email}`}>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                </a>
              )}
              <Link href={`/activities?contactId=${id}`}>
                <Button variant="outline" size="sm">
                  Log Activity
                </Button>
              </Link>
              <Link href={`/tasks/new?contactId=${id}`}>
                <Button variant="outline" size="sm">
                  Create Task
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
