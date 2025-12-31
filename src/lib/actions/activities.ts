'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import {
  activities,
  facilities,
  contacts,
  deals,
  type NewActivity,
  type Activity,
} from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type ActivityWithRelations = Activity & {
  facility: { id: string; name: string } | null;
  contact: { id: string; name: string } | null;
  deal: { id: string; name: string } | null;
};

export async function getActivities(limit?: number): Promise<ActivityWithRelations[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  let query = db
    .select({
      activity: activities,
      facility: {
        id: facilities.id,
        name: facilities.name,
      },
      contact: {
        id: contacts.id,
        name: contacts.name,
      },
      deal: {
        id: deals.id,
        name: deals.name,
      },
    })
    .from(activities)
    .leftJoin(facilities, eq(activities.facilityId, facilities.id))
    .leftJoin(contacts, eq(activities.contactId, contacts.id))
    .leftJoin(deals, eq(activities.dealId, deals.id))
    .where(eq(activities.userId, user.id))
    .orderBy(desc(activities.occurredAt));

  if (limit) {
    query = query.limit(limit) as typeof query;
  }

  const result = await query;

  return result.map((r) => ({
    ...r.activity,
    facility: r.facility,
    contact: r.contact,
    deal: r.deal,
  }));
}

export async function getRecentActivities(limit: number = 10): Promise<ActivityWithRelations[]> {
  return getActivities(limit);
}

export async function getActivity(id: string): Promise<Activity | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db.select().from(activities).where(eq(activities.id, id)).limit(1);
  return result[0];
}

export async function createActivity(
  data: Omit<NewActivity, 'userId' | 'createdAt'>
): Promise<Activity> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db
    .insert(activities)
    .values({
      ...data,
      userId: user.id,
    })
    .returning();

  revalidatePath('/activities');
  revalidatePath('/dashboard');
  if (data.facilityId) {
    revalidatePath(`/facilities/${data.facilityId}`);
  }
  if (data.dealId) {
    revalidatePath(`/pipeline/${data.dealId}`);
  }
  return result[0];
}

export async function updateActivity(
  id: string,
  data: Partial<Omit<NewActivity, 'userId' | 'createdAt'>>
): Promise<Activity> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db.update(activities).set(data).where(eq(activities.id, id)).returning();

  revalidatePath('/activities');
  revalidatePath('/dashboard');
  return result[0];
}

export async function deleteActivity(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  await db.delete(activities).where(eq(activities.id, id));
  revalidatePath('/activities');
  revalidatePath('/dashboard');
}
