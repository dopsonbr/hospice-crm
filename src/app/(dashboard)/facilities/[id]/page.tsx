import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFacility, deleteFacility } from '@/lib/actions/facilities';
import { getContactsByFacility } from '@/lib/actions/contacts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Edit, Trash2, Plus, Phone, Mail } from 'lucide-react';
import { redirect } from 'next/navigation';

const facilityTypeLabels: Record<string, string> = {
  hospice: 'Hospice',
  home_health: 'Home Health',
  palliative: 'Palliative',
  hybrid: 'Hybrid',
};

const ownershipTypeLabels: Record<string, string> = {
  for_profit: 'For-Profit',
  non_profit: 'Non-Profit',
  hospital_affiliated: 'Hospital-Affiliated',
  independent: 'Independent',
};

const buyerRoleLabels: Record<string, string> = {
  decision_maker: 'Decision Maker',
  influencer: 'Influencer',
  champion: 'Champion',
  blocker: 'Blocker',
  end_user: 'End User',
};

export default async function FacilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facility = await getFacility(id);

  if (!facility) {
    notFound();
  }

  const contacts = await getContactsByFacility(id);

  async function handleDelete() {
    'use server';
    await deleteFacility(id);
    redirect('/facilities');
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 sm:mb-6">
        <Link
          href="/facilities"
          className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Facilities
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{facility.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {facilityTypeLabels[facility.facilityType] ?? facility.facilityType}
              </Badge>
              {facility.ownershipType && (
                <Badge variant="outline">{ownershipTypeLabels[facility.ownershipType]}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/facilities/${id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </Link>
            <form action={handleDelete}>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Facility Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <dl className="grid gap-3 grid-cols-2 sm:gap-4">
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  Census Size
                </dt>
                <dd className="text-sm text-slate-900 dark:text-white sm:text-base">{facility.censusSize ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  Annual Revenue
                </dt>
                <dd className="text-sm text-slate-900 dark:text-white sm:text-base">
                  {facility.annualRevenue
                    ? `$${Number(facility.annualRevenue).toLocaleString()}`
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  Medicare Provider #
                </dt>
                <dd className="text-sm text-slate-900 dark:text-white sm:text-base">
                  {facility.medicareProviderId ?? '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  Current Software
                </dt>
                <dd className="text-sm text-slate-900 dark:text-white sm:text-base">
                  {facility.currentSoftware ?? '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <dl className="space-y-3 sm:space-y-4">
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">Address</dt>
                <dd className="text-sm text-slate-900 dark:text-white sm:text-base">{facility.address ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  City, State ZIP
                </dt>
                <dd className="text-sm text-slate-900 dark:text-white sm:text-base">
                  {[facility.city, facility.state, facility.zip].filter(Boolean).join(', ') || '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Competitive Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <dl className="space-y-3 sm:space-y-4">
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  Contract Renewal Date
                </dt>
                <dd className="text-sm text-slate-900 dark:text-white sm:text-base">
                  {facility.contractRenewalDate
                    ? new Date(facility.contractRenewalDate).toLocaleDateString()
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  Pain Points
                </dt>
                <dd className="whitespace-pre-wrap text-sm text-slate-900 dark:text-white sm:text-base">
                  {facility.painPoints ?? '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              {facility.notes ?? 'No notes yet.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 sm:mt-8">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Contacts ({contacts.length})
          </h2>
          <Link href={`/contacts/new?facilityId=${id}`}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Contact</span>
            </Button>
          </Link>
        </div>

        {contacts.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center sm:py-8">
              <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                No contacts yet. Add your first contact for this facility.
              </p>
            </CardContent>
          </Card>
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
                          <p className="text-sm text-slate-600 dark:text-slate-400">{contact.title}</p>
                        )}
                      </div>
                      {contact.buyerRole && (
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {buyerRoleLabels[contact.buyerRole] ?? contact.buyerRole}
                        </Badge>
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
                            Call
                          </a>
                        )}
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                          >
                            <Mail className="h-4 w-4" />
                            Email
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <Card className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
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
                        {contact.buyerRole ? (
                          <Badge variant="outline">
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
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          )}
                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <Mail className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
