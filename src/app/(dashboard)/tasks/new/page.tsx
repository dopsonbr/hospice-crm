'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTask } from '@/lib/actions/tasks';
import { TASK_TYPES, PRIORITIES } from '@/lib/constants';
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

export default function NewTaskPage() {
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

  // Set default due date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDueDate = tomorrow.toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createTask({
        type: formData.get('type') as string,
        description: formData.get('description') as string,
        facilityId: selectedFacilityId || null,
        contactId: (formData.get('contactId') as string) || null,
        dealId: (formData.get('dealId') as string) || null,
        dueAt: formData.get('dueAt') ? new Date(formData.get('dueAt') as string) : null,
        priority: (formData.get('priority') as string) || 'medium',
      });
      router.push('/tasks');
    } catch (error) {
      console.error('Failed to create task:', error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/tasks"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Task</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="What needs to be done?"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Task Type *</Label>
                  <Select name="type" defaultValue="follow_up">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueAt">Due Date</Label>
                <Input id="dueAt" name="dueAt" type="date" defaultValue={defaultDueDate} />
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
                    <SelectValue placeholder="Select facility (optional)" />
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
                    <SelectValue placeholder="Select contact (optional)" />
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
                    <SelectValue placeholder="Select deal (optional)" />
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
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
          <Link href="/tasks">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
