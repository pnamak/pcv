import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const staffUsers = sqliteTable("staff_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("editor"),
  createdAt: text("created_at").notNull(),
});

export const pastors = sqliteTable("pastors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  rank: text("rank").notNull().default("Pastor"),
  ordinationYear: integer("ordination_year"),
  islandOrigin: text("island_origin"),
  villageOrigin: text("village_origin"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const churches = sqliteTable("churches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  areaCouncil: text("area_council"),
  sessionName: text("session_name"),
  presbytery: text("presbytery"),
  island: text("island"),
  province: text("province"),
  pastorId: integer("pastor_id").references(() => pastors.id),
  latitude: real("latitude"),
  longitude: real("longitude"),
  memberCount: integer("member_count").default(0),
  serviceTimes: text("service_times"),
  tags: text("tags"),
  logoPath: text("logo_path"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  category: text("category"),
  province: text("province"),
  churchId: integer("church_id").references(() => churches.id),
  createdAt: text("created_at").notNull(),
});

export const newsArticles = sqliteTable("news_articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content").notNull(),
  churchId: integer("church_id").references(() => churches.id),
  status: text("status").notNull().default("draft"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  churchId: integer("church_id").references(() => churches.id),
  presbytery: text("presbytery"),
  reportType: text("report_type").notNull().default("general"),
  visibility: text("visibility").notNull().default("private"),
  uploadedBy: integer("uploaded_by").references(() => staffUsers.id),
  uploadedAt: text("uploaded_at").notNull(),
});

export const churchPrograms = sqliteTable("church_programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  createdAt: text("created_at").notNull(),
});

export type StaffUser = typeof staffUsers.$inferSelect;
export type Pastor = typeof pastors.$inferSelect;
export type Church = typeof churches.$inferSelect;
export type Event = typeof events.$inferSelect;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type ChurchProgram = typeof churchPrograms.$inferSelect;
