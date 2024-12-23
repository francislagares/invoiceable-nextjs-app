import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { AVAILABLE_STATUSES } from '@/constants/invoice-status';

export type Status = (typeof AVAILABLE_STATUSES)[number]['id'];

const statuses = AVAILABLE_STATUSES.map(({ id }) => id) as Array<Status>;

export const statusEnum = pgEnum(
  'status',
  statuses as [Status, ...Array<Status>],
);

export const Invoice = pgTable('invoice', {
  id: serial('id').primaryKey().notNull(),
  createTs: timestamp('createTs').defaultNow().notNull(),
  value: integer('value').notNull(),
  description: text('description').notNull(),
  userId: text('userId').notNull(),
  organizationId: text('organizationId'),
  customerId: integer('customerId')
    .notNull()
    .references(() => Customer.id),
  status: statusEnum('status').notNull(),
});

export const Customer = pgTable('customer', {
  id: serial('id').primaryKey().notNull(),
  createTs: timestamp('createTs').defaultNow().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  userId: text('userId').notNull(),
  organizationId: text('organizationId'),
});
