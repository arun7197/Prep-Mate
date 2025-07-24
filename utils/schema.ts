
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mock_interview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: text('jobPosition').notNull(),
  jobDesc: text('jobDesc').notNull(),
  jobExperience: varchar('jobExperience').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt'),
  mockId: varchar('mockId').notNull(), 
});

export const UserAnswer =pgTable('userAnswer',{
  id:serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(), 
  question:  varchar('question').notNull(),
  correctAns:  text('correctAns').notNull(),
  userAns: text('userAns').notNull(),
  rating: varchar('rating').notNull(),
  feedback: text('feedback').notNull(),
  userEmail: varchar('userEmail').notNull(),
  createdAt: varchar('createdAt'),
})
