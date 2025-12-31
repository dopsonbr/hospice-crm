"use server"

import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { contacts, facilities, type NewContact, type Contact } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type ContactWithFacility = Contact & {
  facility: { id: string; name: string } | null
}

export async function getContacts(): Promise<ContactWithFacility[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db
    .select({
      contact: contacts,
      facility: {
        id: facilities.id,
        name: facilities.name,
      },
    })
    .from(contacts)
    .leftJoin(facilities, eq(contacts.facilityId, facilities.id))
    .where(eq(contacts.userId, user.id))
    .orderBy(desc(contacts.createdAt))

  return result.map((r) => ({
    ...r.contact,
    facility: r.facility,
  }))
}

export async function getContactsByFacility(facilityId: string): Promise<Contact[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return db.select().from(contacts).where(eq(contacts.facilityId, facilityId)).orderBy(desc(contacts.createdAt))
}

export async function getContact(id: string): Promise<Contact | undefined> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1)
  return result[0]
}

export async function createContact(data: Omit<NewContact, "userId" | "createdAt" | "updatedAt">): Promise<Contact> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db.insert(contacts).values({
    ...data,
    userId: user.id,
  }).returning()

  revalidatePath("/contacts")
  revalidatePath("/dashboard")
  if (data.facilityId) {
    revalidatePath(`/facilities/${data.facilityId}`)
  }
  return result[0]
}

export async function updateContact(id: string, data: Partial<Omit<NewContact, "userId" | "createdAt" | "updatedAt">>): Promise<Contact> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const result = await db.update(contacts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(contacts.id, id))
    .returning()

  revalidatePath("/contacts")
  revalidatePath(`/contacts/${id}`)
  revalidatePath("/dashboard")
  return result[0]
}

export async function deleteContact(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.delete(contacts).where(eq(contacts.id, id))
  revalidatePath("/contacts")
  revalidatePath("/dashboard")
}
