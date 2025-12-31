'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createActivity } from '@/lib/actions/activities';
import { ACTIVITY_TYPES, OUTCOMES } from '@/lib/constants';
import { getFacilities } from '@/lib/actions/facilities';
import { getContacts } from '@/lib/actions/contacts';
import { getActiveDeals } from '@/lib/actions/deals';
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
import type { Facility, Contact, Deal } from '@/lib/db/schema';

export default function NewActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedFacilityId = searchParams.get('facilityId');
  const preselectedContactId = searchParams.get('contactId');
  const preselectedDealId = searchParams.get('dealId');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(preselectedFacilityId ?? '');

  useEffect(() => {
    async function loadData() {
      const [facilitiesData, contactsData, dealsData] = await Promise.all([
        getFacilities(),
        getContacts(),
        getActiveDeals(),
      ]);
      setFacilities(facilitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    }
    loadData();
  }, []);

  // Default to now
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().slice(0, 5);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const dateStr = formData.get('date') as string;
    const timeStr = formData.get('time') as string;
    const occurredAt = dateStr && timeStr ? new Date(`${dateStr}T${timeStr}`) : new Date();

    try {
      await createActivity({
        type: formData.get('type') as string,
        subject: formData.get('subject') as string,
        facilityId: selectedFacilityId || null,
        contactId: (formData.get('contactId') as string) || null,
        dealId: (formData.get('dealId') as string) || null,
        occurredAt,
        duration: formData.get('duration') ? Number(formData.get('duration')) : null,
        outcome: (formData.get('outcome') as string) || null,
        notes: (formData.get('notes') as string) || null,
      });
      router.push('/activities');
    } catch (error) {
      console.error('Failed to create activity:', error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/activities"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activities
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Log Activity</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  required
                  placeholder="Discovery call with John"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Activity Type *</Label>
                  <Select name="type" defaultValue="call">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcome">Outcome</Label>
                  <Select name="outcome">
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      {OUTCOMES.map((outcome) => (
                        <SelectItem key={outcome.value} value={outcome.value}>
                          {outcome.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" defaultValue={defaultDate} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" defaultValue={defaultTime} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" name="duration" type="number" min="0" placeholder="30" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Meeting summary, action items, key takeaways..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="contactId">Contact</Label>
                <Select name="contactId" defaultValue={preselectedContactId ?? undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealId">Deal</Label>
                <Select name="dealId" defaultValue={preselectedDealId ?? undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select deal" />
                  </SelectTrigger>
                  <SelectContent>
                    {deals.map((deal) => (
                      <SelectItem key={deal.id} value={deal.id}>
                        {deal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Log Activity'}
          </Button>
          <Link href="/activities">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
