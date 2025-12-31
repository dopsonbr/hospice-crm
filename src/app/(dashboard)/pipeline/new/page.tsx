'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createDeal } from '@/lib/actions/deals';
import { DEAL_STAGES } from '@/lib/constants';
import { getFacilities } from '@/lib/actions/facilities';
import { getContacts } from '@/lib/actions/contacts';
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
import type { Facility, Contact } from '@/lib/db/schema';

export default function NewDealPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedFacilityId = searchParams.get('facilityId');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(preselectedFacilityId ?? '');

  useEffect(() => {
    async function loadData() {
      const [facilitiesData, contactsData] = await Promise.all([getFacilities(), getContacts()]);
      setFacilities(facilitiesData);
      setContacts(contactsData);
    }
    loadData();
  }, []);

  const filteredContacts = useMemo(() => {
    if (selectedFacilityId) {
      return contacts.filter((c) => c.facilityId === selectedFacilityId);
    }
    return contacts;
  }, [selectedFacilityId, contacts]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createDeal({
        name: formData.get('name') as string,
        facilityId: selectedFacilityId || null,
        primaryContactId: (formData.get('primaryContactId') as string) || null,
        stage: (formData.get('stage') as string) || 'lead',
        value: (formData.get('value') as string) || null,
        recurringValue: (formData.get('recurringValue') as string) || null,
        probability: formData.get('probability') ? Number(formData.get('probability')) : null,
        expectedCloseDate: formData.get('expectedCloseDate')
          ? new Date(formData.get('expectedCloseDate') as string)
          : null,
        nextStep: (formData.get('nextStep') as string) || null,
        competitors: (formData.get('competitors') as string) || null,
        notes: (formData.get('notes') as string) || null,
      });
      router.push('/pipeline');
    } catch (error) {
      console.error('Failed to create deal:', error);
      setIsSubmitting(false);
    }
  }

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);
  const defaultName = selectedFacility ? `${selectedFacility.name} - Deal` : '';

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Deal</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Deal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Deal Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Sunshine Hospice - Enterprise License"
                  defaultValue={defaultName}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilityId">Facility</Label>
                <Select value={selectedFacilityId} onValueChange={setSelectedFacilityId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryContactId">Primary Contact</Label>
                <Select name="primaryContactId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredContacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} {contact.title ? `(${contact.title})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select name="stage" defaultValue="lead">
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_STAGES.filter(
                      (s) => s.value !== 'closed_won' && s.value !== 'closed_lost'
                    ).map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label} ({stage.probability}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Value & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="value">Deal Value</Label>
                  <Input id="value" name="value" type="number" step="0.01" placeholder="50000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurringValue">Annual Recurring Value</Label>
                  <Input
                    id="recurringValue"
                    name="recurringValue"
                    type="number"
                    step="0.01"
                    placeholder="12000"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    name="probability"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Auto from stage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input id="expectedCloseDate" name="expectedCloseDate" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Competitors</Label>
                <Input
                  id="competitors"
                  name="competitors"
                  placeholder="Homecare Homebase, Brightree"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Next Steps & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nextStep">Next Step</Label>
                <Input id="nextStep" name="nextStep" placeholder="Schedule discovery call" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Any relevant notes about this deal..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Deal'}
          </Button>
          <Link href="/pipeline">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
