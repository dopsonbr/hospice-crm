import { getFacilities } from '@/lib/actions/facilities';
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
import { Plus, MapPin, Users, Monitor, Calendar } from 'lucide-react';
import Link from 'next/link';

const facilityTypeLabels: Record<string, string> = {
  hospice: 'Hospice',
  home_health: 'Home Health',
  palliative: 'Palliative',
  hybrid: 'Hybrid',
};

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Facilities</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Manage your hospice organization accounts
          </p>
        </div>
        <Link href="/facilities/new" className="self-start sm:self-auto">
          <Button size="sm" className="sm:size-default">
            <Plus className="h-4 w-4" />
            Add Facility
          </Button>
        </Link>
      </div>

      {facilities.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800 sm:p-12">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No facilities yet</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Get started by adding your first facility.
          </p>
          <Link href="/facilities/new">
            <Button className="mt-4">
              <Plus className="h-4 w-4" />
              Add Facility
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="space-y-3 md:hidden">
            {facilities.map((facility) => (
              <Card key={facility.id} className="bg-white dark:bg-slate-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/facilities/${facility.id}`}
                      className="font-medium text-slate-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                    >
                      {facility.name}
                    </Link>
                    <Badge variant="secondary" className="shrink-0">
                      {facilityTypeLabels[facility.facilityType] ?? facility.facilityType}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                    {(facility.city || facility.state) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {facility.city && facility.state
                            ? `${facility.city}, ${facility.state}`
                            : facility.city || facility.state}
                        </span>
                      </div>
                    )}
                    {facility.censusSize && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        <span>Census: {facility.censusSize}</span>
                      </div>
                    )}
                    {facility.currentSoftware && (
                      <div className="flex items-center gap-2">
                        <Monitor className="h-3.5 w-3.5 shrink-0" />
                        <span>{facility.currentSoftware}</span>
                      </div>
                    )}
                    {facility.contractRenewalDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>Renewal: {new Date(facility.contractRenewalDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Census</TableHead>
                  <TableHead className="hidden lg:table-cell">Current Software</TableHead>
                  <TableHead className="hidden lg:table-cell">Contract Renewal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell>
                      <Link
                        href={`/facilities/${facility.id}`}
                        className="font-medium text-slate-900 hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                      >
                        {facility.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {facilityTypeLabels[facility.facilityType] ?? facility.facilityType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {facility.city && facility.state
                        ? `${facility.city}, ${facility.state}`
                        : facility.city || facility.state || '-'}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {facility.censusSize ?? '-'}
                    </TableCell>
                    <TableCell className="hidden text-slate-600 dark:text-slate-400 lg:table-cell">
                      {facility.currentSoftware ?? '-'}
                    </TableCell>
                    <TableCell className="hidden text-slate-600 dark:text-slate-400 lg:table-cell">
                      {facility.contractRenewalDate
                        ? new Date(facility.contractRenewalDate).toLocaleDateString()
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
