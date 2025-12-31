'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { facilities, type NewFacility, type Facility } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getFacilities(): Promise<Facility[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return db
    .select()
    .from(facilities)
    .where(eq(facilities.userId, user.id))
    .orderBy(desc(facilities.createdAt));
}

export async function getFacility(id: string): Promise<Facility | undefined> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db.select().from(facilities).where(eq(facilities.id, id)).limit(1);
  return result[0];
}

export async function createFacility(
  data: Omit<NewFacility, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Facility> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db
    .insert(facilities)
    .values({
      ...data,
      userId: user.id,
    })
    .returning();

  revalidatePath('/facilities');
  revalidatePath('/dashboard');
  return result[0];
}

export async function updateFacility(
  id: string,
  data: Partial<Omit<NewFacility, 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Facility> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const result = await db
    .update(facilities)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(facilities.id, id))
    .returning();

  revalidatePath('/facilities');
  revalidatePath(`/facilities/${id}`);
  revalidatePath('/dashboard');
  return result[0];
}

export async function deleteFacility(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  await db.delete(facilities).where(eq(facilities.id, id));
  revalidatePath('/facilities');
  revalidatePath('/dashboard');
}
