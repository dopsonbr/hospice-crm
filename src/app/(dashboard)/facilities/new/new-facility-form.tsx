'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createFacility } from '@/lib/actions/facilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const facilityTypes = [
  { value: 'hospice', label: 'Hospice' },
  { value: 'home_health', label: 'Home Health' },
  { value: 'palliative', label: 'Palliative Care' },
  { value: 'hybrid', label: 'Hybrid' },
];

const ownershipTypes = [
  { value: 'for_profit', label: 'For-Profit' },
  { value: 'non_profit', label: 'Non-Profit' },
  { value: 'hospital_affiliated', label: 'Hospital-Affiliated' },
  { value: 'independent', label: 'Independent' },
];

const states = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

export default function NewFacilityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createFacility({
        name: formData.get('name') as string,
        facilityType: formData.get('facilityType') as string,
        ownershipType: (formData.get('ownershipType') as string) || null,
        censusSize: formData.get('censusSize') ? Number(formData.get('censusSize')) : null,
        annualRevenue: (formData.get('annualRevenue') as string) || null,
        address: (formData.get('address') as string) || null,
        city: (formData.get('city') as string) || null,
        state: (formData.get('state') as string) || null,
        zip: (formData.get('zip') as string) || null,
        medicareProviderId: (formData.get('medicareProviderId') as string) || null,
        currentSoftware: (formData.get('currentSoftware') as string) || null,
        contractRenewalDate: formData.get('contractRenewalDate')
          ? new Date(formData.get('contractRenewalDate') as string)
          : null,
        painPoints: (formData.get('painPoints') as string) || null,
        notes: (formData.get('notes') as string) || null,
      });
      router.push('/facilities');
    } catch (error) {
      console.error('Failed to create facility:', error);
      setIsSubmitting(false);
    }
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Facility</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Facility Name *</Label>
                <Input id="name" name="name" required placeholder="Sunshine Hospice" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facilityType">Facility Type *</Label>
                  <Select name="facilityType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownershipType">Ownership Type</Label>
                  <Select name="ownershipType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      {ownershipTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="censusSize">Census Size</Label>
                  <Input
                    id="censusSize"
                    name="censusSize"
                    type="number"
                    placeholder="Average daily census"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <Input id="annualRevenue" name="annualRevenue" placeholder="$5,000,000" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="123 Main Street" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" placeholder="Austin" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select name="state">
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input id="zip" name="zip" placeholder="78701" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicareProviderId">Medicare Provider #</Label>
                <Input
                  id="medicareProviderId"
                  name="medicareProviderId"
                  placeholder="CMS certification number"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Competitive Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentSoftware">Current Software</Label>
                <Input
                  id="currentSoftware"
                  name="currentSoftware"
                  placeholder="e.g., Homecare Homebase, Brightree"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractRenewalDate">Contract Renewal Date</Label>
                <Input id="contractRenewalDate" name="contractRenewalDate" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="painPoints">Pain Points</Label>
                <Textarea
                  id="painPoints"
                  name="painPoints"
                  placeholder="Known issues with current solution..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any other relevant information..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Facility'}
          </Button>
          <Link href="/facilities">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
