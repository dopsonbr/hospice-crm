import { pgTable, uuid, text, timestamp, integer, decimal } from 'drizzle-orm/pg-core';

// Facilities table
export const facilities = pgTable('facilities', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  facilityType: text('facility_type').notNull(), // hospice, home_health, palliative, hybrid
  ownershipType: text('ownership_type'), // for_profit, non_profit, hospital_affiliated, independent
  censusSize: integer('census_size'),
  annualRevenue: decimal('annual_revenue', { precision: 12, scale: 2 }),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
  medicareProviderId: text('medicare_provider_id'),
  currentSoftware: text('current_software'),
  contractRenewalDate: timestamp('contract_renewal_date', { withTimezone: true }),
  painPoints: text('pain_points'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Contacts table
export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  facilityId: uuid('facility_id').references(() => facilities.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  title: text('title'),
  buyerRole: text('buyer_role'), // decision_maker, influencer, champion, blocker, end_user
  email: text('email'),
  phone: text('phone'),
  mobile: text('mobile'),
  preferredContact: text('preferred_contact'),
  linkedinUrl: text('linkedin_url'),
  notes: text('notes'),
  lastContactAt: timestamp('last_contact_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Deals table
export const deals = pgTable('deals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  facilityId: uuid('facility_id').references(() => facilities.id, { onDelete: 'cascade' }),
  primaryContactId: uuid('primary_contact_id').references(() => contacts.id),
  name: text('name').notNull(),
  stage: text('stage').default('lead').notNull(), // lead, discovery, demo_scheduled, demo_completed, proposal_sent, negotiation, verbal_commit, closed_won, closed_lost
  value: decimal('value', { precision: 12, scale: 2 }),
  recurringValue: decimal('recurring_value', { precision: 12, scale: 2 }),
  probability: integer('probability'),
  expectedCloseDate: timestamp('expected_close_date', { withTimezone: true }),
  nextStep: text('next_step'),
  lossReason: text('loss_reason'),
  competitors: text('competitors'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Activities table
export const activities = pgTable('activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  facilityId: uuid('facility_id').references(() => facilities.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id),
  dealId: uuid('deal_id').references(() => deals.id),
  type: text('type').notNull(), // call, email, meeting, demo, follow_up, other
  subject: text('subject').notNull(),
  notes: text('notes'),
  outcome: text('outcome'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  duration: integer('duration'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  facilityId: uuid('facility_id').references(() => facilities.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id),
  dealId: uuid('deal_id').references(() => deals.id),
  type: text('type').notNull(), // call, email, meeting, demo, follow_up, other
  description: text('description').notNull(),
  dueAt: timestamp('due_at', { withTimezone: true }),
  priority: text('priority').default('medium'), // high, medium, low
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Export types
export type Facility = typeof facilities.$inferSelect;
export type NewFacility = typeof facilities.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
