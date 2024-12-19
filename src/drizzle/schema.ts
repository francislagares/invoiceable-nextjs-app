import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', [
  'open',
  'paid',
  'void',
  'uncollectible',
]);

export const Invoice = pgTable('invoice', {
  id: serial('id').primaryKey().notNull(),
  createTs: timestamp('create_ts').notNull().defaultNow(),
  value: integer('value').notNull(),
  description: text('description').notNull(),
  status: statusEnum('status').notNull(),
});
