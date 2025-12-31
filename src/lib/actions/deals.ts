'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { deals, facilities, contacts, type NewDeal, type Deal } from '@/lib/db/schema';
import { eq, desc, and, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { DealStage } from '@/lib/constants';

export type DealWithRelations = Deal & {
  facility: { id: string; name: string; city: string | null; state: string | null } | null;
  primaryContact: { id: string; name: string } | null;
};

export async function getDeals(): Promise<DealWithRelations[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db
    .select({
      deal: deals,
      facility: {
        id: facilities.id,
        name: facilities.name,
        city: facilities.city,
        state: facilities.state,
      },
      primaryContact: {
        id: contacts.id,
        name: contacts.name,
      },
    })
    .from(deals)
    .leftJoin(facilities, eq(deals.facilityId, facilities.id))
    .leftJoin(contacts, eq(deals.primaryContactId, contacts.id))
    .where(eq(deals.userId, user.id))
    .orderBy(desc(deals.createdAt));

  return result.map((r) => ({
    ...r.deal,
    facility: r.facility,
    primaryContact: r.primaryContact,
  }));
}

export async function getActiveDeals(): Promise<DealWithRelations[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db
    .select({
      deal: deals,
      facility: {
        id: facilities.id,
        name: facilities.name,
        city: facilities.city,
        state: facilities.state,
      },
      primaryContact: {
        id: contacts.id,
        name: contacts.name,
      },
    })
    .from(deals)
    .leftJoin(facilities, eq(deals.facilityId, facilities.id))
    .leftJoin(contacts, eq(deals.primaryContactId, contacts.id))
    .where(
      and(eq(deals.userId, user.id), ne(deals.stage, 'closed_won'), ne(deals.stage, 'closed_lost'))
    )
    .orderBy(desc(deals.createdAt));

  return result.map((r) => ({
    ...r.deal,
    facility: r.facility,
    primaryContact: r.primaryContact,
  }));
}

export async function getDeal(id: string): Promise<DealWithRelations | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db
    .select({
      deal: deals,
      facility: {
        id: facilities.id,
        name: facilities.name,
        city: facilities.city,
        state: facilities.state,
      },
      primaryContact: {
        id: contacts.id,
        name: contacts.name,
      },
    })
    .from(deals)
    .leftJoin(facilities, eq(deals.facilityId, facilities.id))
    .leftJoin(contacts, eq(deals.primaryContactId, contacts.id))
    .where(eq(deals.id, id))
    .limit(1);

  if (!result[0]) return undefined;

  return {
    ...result[0].deal,
    facility: result[0].facility,
    primaryContact: result[0].primaryContact,
  };
}

export async function createDeal(
  data: Omit<NewDeal, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Deal> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db
    .insert(deals)
    .values({
      ...data,
      userId: user.id,
    })
    .returning();

  revalidatePath('/pipeline');
  revalidatePath('/dashboard');
  if (data.facilityId) {
    revalidatePath(`/facilities/${data.facilityId}`);
  }
  return result[0];
}

export async function updateDeal(
  id: string,
  data: Partial<Omit<NewDeal, 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Deal> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db
    .update(deals)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(deals.id, id))
    .returning();

  revalidatePath('/pipeline');
  revalidatePath(`/pipeline/${id}`);
  revalidatePath('/dashboard');
  return result[0];
}

export async function updateDealStage(id: string, stage: DealStage): Promise<Deal> {
  return updateDeal(id, { stage });
}

export async function deleteDeal(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  await db.delete(deals).where(eq(deals.id, id));
  revalidatePath('/pipeline');
  revalidatePath('/dashboard');
}
