import { getFacilities } from '@/lib/actions/facilities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';
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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Facilities</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your hospice organization accounts
          </p>
        </div>
        <Link href="/facilities/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Facility
          </Button>
        </Link>
      </div>

      {facilities.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No facilities yet</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
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
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facility</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Census</TableHead>
                <TableHead>Current Software</TableHead>
                <TableHead>Contract Renewal</TableHead>
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
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {facility.currentSoftware ?? '-'}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {facility.contractRenewalDate
                      ? new Date(facility.contractRenewalDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
