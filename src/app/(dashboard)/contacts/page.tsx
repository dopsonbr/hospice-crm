import { getContacts } from '@/lib/actions/contacts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Phone, Mail, Building2, Calendar } from 'lucide-react';
import Link from 'next/link';

const buyerRoleLabels: Record<string, string> = {
  decision_maker: 'Decision Maker',
  influencer: 'Influencer',
  champion: 'Champion',
  blocker: 'Blocker',
  end_user: 'End User',
};

const buyerRoleColors: Record<
  string,
  'default' | 'secondary' | 'success' | 'warning' | 'destructive'
> = {
  decision_maker: 'default',
  champion: 'success',
  influencer: 'secondary',
  blocker: 'destructive',
  end_user: 'secondary',
};

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Contacts</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Manage your facility contacts and key stakeholders
          </p>
        </div>
        <Link href="/contacts/new" className="self-start sm:self-auto">
          <Button size="sm" className="sm:size-default">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800 sm:p-12">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No contacts yet</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
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
        <>
          {/* Mobile Card View */}
          <div className="space-y-3 md:hidden">
            {contacts.map((contact) => (
              <Card key={contact.id} className="bg-white dark:bg-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="font-medium text-slate-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                      >
                        {contact.name}
                      </Link>
                      {contact.title && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {contact.title}
                        </p>
                      )}
                    </div>
                    {contact.buyerRole && (
                      <Badge
                        variant={buyerRoleColors[contact.buyerRole] ?? 'secondary'}
                        className="shrink-0"
                      >
                        {buyerRoleLabels[contact.buyerRole] ?? contact.buyerRole}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                    {contact.facility && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <Link
                          href={`/facilities/${contact.facility.id}`}
                          className="truncate hover:text-teal-600 dark:hover:text-teal-400"
                        >
                          {contact.facility.name}
                        </Link>
                      </div>
                    )}
                    {contact.lastContactAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          Last contact: {new Date(contact.lastContactAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {(contact.phone || contact.email) && (
                    <div className="mt-3 flex items-center gap-3">
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                          <Phone className="h-4 w-4" />
                          <span className="hidden xs:inline">Call</span>
                        </a>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="hidden xs:inline">Email</span>
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Contact</TableHead>
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
                      {contact.title ?? '-'}
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
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.buyerRole ? (
                        <Badge variant={buyerRoleColors[contact.buyerRole] ?? 'secondary'}>
                          {buyerRoleLabels[contact.buyerRole] ?? contact.buyerRole}
                        </Badge>
                      ) : (
                        '-'
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
                    <TableCell className="hidden text-slate-600 dark:text-slate-400 lg:table-cell">
                      {contact.lastContactAt
                        ? new Date(contact.lastContactAt).toLocaleDateString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
