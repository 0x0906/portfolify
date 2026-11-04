import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const portfolios = pgTable("portfolios", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  templateId: text("template_id").notNull().default("minimal"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  publishedSnapshot: text("published_snapshot"),
})

export const portfolioProfiles = pgTable("portfolio_profiles", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().unique().references(() => portfolios.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  professionalTitle: text("professional_title"),
  introduction: text("introduction"),
  biography: text("biography"),
  location: text("location"),
  profileImageUrl: text("profile_image_url"),
  publicContactEmail: text("public_contact_email"),
})

export const portfolioProjects = pgTable("portfolio_projects", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  technologies: text("technologies"),
  imageUrl: text("image_url"),
  liveUrl: text("live_url"),
  sourceUrl: text("source_url"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  isFeatured: boolean("is_featured").default(false),
  displayOrder: integer("display_order").default(0),
})

export const portfolioSkills = pgTable("portfolio_skills", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  level: text("level"),
  proficiency: integer("proficiency"),
  displayOrder: integer("display_order").default(0),
})

export const portfolioExperience = pgTable("portfolio_experience", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  employmentType: text("employment_type"),
  description: text("description"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  displayOrder: integer("display_order").default(0),
})

export const portfolioEducation = pgTable("portfolio_education", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  institution: text("institution").notNull(),
  degree: text("degree"),
  fieldOfStudy: text("field_of_study"),
  mark: text("mark"),
  location: text("location"),
  startYear: text("start_year"),
  endYear: text("end_year"),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
})

export const portfolioCertifications = pgTable("portfolio_certifications", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date"),
  credentialUrl: text("credential_url"),
})

export const portfolioSocialLinks = pgTable("portfolio_social_links", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  displayOrder: integer("display_order").default(0),
})

export const portfolioSections = pgTable("portfolio_sections", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  sectionKey: text("section_key").notNull(),
  isVisible: boolean("is_visible").default(true),
  displayOrder: integer("display_order").default(0),
})

export const portfolioThemeSettings = pgTable("portfolio_theme_settings", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().unique().references(() => portfolios.id, { onDelete: "cascade" }),
  colorScheme: text("color_scheme").default("blue"),
  fontScheme: text("font_scheme").default("inter"),
  themeMode: text("theme_mode").default("system"),
})

export const portfolioAssets = pgTable("portfolio_assets", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  assetType: text("asset_type").notNull(),
  storagePath: text("storage_path").notNull(),
  originalFilename: text("original_filename").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export const portfolioAnalytics = pgTable("portfolio_analytics", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id").notNull().references(() => portfolios.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull().default("pageview"),
  visitedAt: timestamp("visited_at", { withTimezone: true }).defaultNow(),
})
