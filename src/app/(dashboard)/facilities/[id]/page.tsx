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
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/facilities"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Facilities
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{facility.name}</h1>
            <div className="mt-2 flex items-center gap-2">
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
            <CardTitle>Facility Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Census Size
                </dt>
                <dd className="text-slate-900 dark:text-white">{facility.censusSize ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Annual Revenue
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {facility.annualRevenue
                    ? `$${Number(facility.annualRevenue).toLocaleString()}`
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Medicare Provider #
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {facility.medicareProviderId ?? '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Current Software
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {facility.currentSoftware ?? '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Address</dt>
                <dd className="text-slate-900 dark:text-white">{facility.address ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  City, State ZIP
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {[facility.city, facility.state, facility.zip].filter(Boolean).join(', ') || '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competitive Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Contract Renewal Date
                </dt>
                <dd className="text-slate-900 dark:text-white">
                  {facility.contractRenewalDate
                    ? new Date(facility.contractRenewalDate).toLocaleDateString()
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Pain Points
                </dt>
                <dd className="whitespace-pre-wrap text-slate-900 dark:text-white">
                  {facility.painPoints ?? '-'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-400">
              {facility.notes ?? 'No notes yet.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Contacts ({contacts.length})
          </h2>
          <Link href={`/contacts/new?facilityId=${id}`}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </Link>
        </div>

        {contacts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                No contacts yet. Add your first contact for this facility.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
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
        )}
      </div>
    </div>
  );
}
