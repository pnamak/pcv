import { relations } from "drizzle-orm";
import {
  staffUsers,
  pastors,
  churches,
  events,
  newsArticles,
  reports,
} from "./schema";

export const pastorsRelations = relations(pastors, ({ many }) => ({
  churches: many(churches),
}));

export const churchesRelations = relations(churches, ({ one, many }) => ({
  pastor: one(pastors, {
    fields: [churches.pastorId],
    references: [pastors.id],
  }),
  events: many(events),
  reports: many(reports),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  church: one(churches, {
    fields: [events.churchId],
    references: [churches.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  church: one(churches, {
    fields: [reports.churchId],
    references: [churches.id],
  }),
  uploader: one(staffUsers, {
    fields: [reports.uploadedBy],
    references: [staffUsers.id],
  }),
}));

export const staffUsersRelations = relations(staffUsers, ({ many }) => ({
  reports: many(reports),
}));

export const newsArticlesRelations = relations(newsArticles, () => ({}));
