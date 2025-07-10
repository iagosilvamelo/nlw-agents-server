import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { rooms } from './rooms.ts';

export const questions = pgTable('questions', {
  id: uuid().primaryKey().defaultRandom(),
  room_id: uuid()
    .references(() => rooms.id)
    .notNull(),
  question: text().notNull(),
  answer: text(),
  created_at: timestamp().defaultNow().notNull(),
});
