import { getContacts } from "@/lib/actions/contacts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Phone, Mail } from "lucide-react"
import Link from "next/link"

const buyerRoleLabels: Record<string, string> = {
  decision_maker: "Decision Maker",
  influencer: "Influencer",
  champion: "Champion",
  blocker: "Blocker",
  end_user: "End User",
}

const buyerRoleColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  decision_maker: "default",
  champion: "success",
  influencer: "secondary",
  blocker: "destructive",
  end_user: "secondary",
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Contacts</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your facility contacts and key stakeholders
          </p>
        </div>
        <Link href="/contacts/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No contacts yet</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Get started by adding your first contact.
          </p>
          <Link href="/contacts/new">
            <Button className="mt-4">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="font-medium text-slate-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                    >
                      {contact.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {contact.title ?? "-"}
                  </TableCell>
                  <TableCell>
                    {contact.facility ? (
                      <Link
                        href={`/facilities/${contact.facility.id}`}
                        className="text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
                      >
                        {contact.facility.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.buyerRole ? (
                      <Badge variant={buyerRoleColors[contact.buyerRole] ?? "secondary"}>
                        {buyerRoleLabels[contact.buyerRole] ?? contact.buyerRole}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-slate-400 hover:text-slate-600"
                          title={contact.phone}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-slate-400 hover:text-slate-600"
                          title={contact.email}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {contact.lastContactAt
                      ? new Date(contact.lastContactAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
