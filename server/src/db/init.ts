import { pool } from "./index.js"

export async function initDatabase(): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "email_verified" boolean DEFAULT false NOT NULL,
        "image" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "session" (
        "id" text PRIMARY KEY NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "token" text NOT NULL UNIQUE,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        "ip_address" text,
        "user_agent" text,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade
      );

      CREATE TABLE IF NOT EXISTS "account" (
        "id" text PRIMARY KEY NOT NULL,
        "account_id" text NOT NULL,
        "provider_id" text NOT NULL,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
        "access_token" text,
        "refresh_token" text,
        "id_token" text,
        "access_token_expires_at" timestamp with time zone,
        "refresh_token_expires_at" timestamp with time zone,
        "scope" text,
        "password" text,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "verification" (
        "id" text PRIMARY KEY NOT NULL,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "portfolios" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
        "username" text NOT NULL UNIQUE,
        "template_id" text DEFAULT 'modern' NOT NULL,
        "status" text DEFAULT 'draft' NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        "published_at" timestamp with time zone,
        "published_snapshot" text
      );

      CREATE TABLE IF NOT EXISTS "portfolio_profiles" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL UNIQUE REFERENCES "portfolios"("id") ON DELETE cascade,
        "full_name" text NOT NULL,
        "professional_title" text,
        "introduction" text,
        "biography" text,
        "location" text,
        "profile_image_url" text,
        "public_contact_email" text
      );

      CREATE TABLE IF NOT EXISTS "portfolio_theme_settings" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL UNIQUE REFERENCES "portfolios"("id") ON DELETE cascade,
        "color_scheme" text DEFAULT 'blue',
        "font_scheme" text DEFAULT 'inter',
        "theme_mode" text DEFAULT 'system'
      );

      CREATE TABLE IF NOT EXISTS "portfolio_projects" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "title" text NOT NULL,
        "description" text,
        "technologies" text,
        "image_url" text,
        "live_url" text,
        "source_url" text,
        "start_date" text,
        "end_date" text,
        "is_featured" boolean DEFAULT false,
        "display_order" integer DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS "portfolio_skills" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "name" text NOT NULL,
        "category" text NOT NULL,
        "level" text,
        "proficiency" integer,
        "display_order" integer DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS "portfolio_experience" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "job_title" text NOT NULL,
        "company" text NOT NULL,
        "location" text,
        "employment_type" text,
        "description" text,
        "start_date" text,
        "end_date" text,
        "display_order" integer DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS "portfolio_education" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "institution" text NOT NULL,
        "degree" text,
        "field_of_study" text,
        "mark" text,
        "location" text,
        "start_year" text,
        "end_year" text,
        "description" text,
        "display_order" integer DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS "portfolio_certifications" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "name" text NOT NULL,
        "issuer" text NOT NULL,
        "issue_date" text,
        "credential_url" text
      );

      CREATE TABLE IF NOT EXISTS "portfolio_social_links" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "platform" text NOT NULL,
        "url" text NOT NULL,
        "display_order" integer DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS "portfolio_assets" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "asset_type" text NOT NULL,
        "storage_path" text NOT NULL,
        "original_filename" text NOT NULL,
        "mime_type" text NOT NULL,
        "size_bytes" integer NOT NULL,
        "created_at" timestamp with time zone DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "portfolio_analytics" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "event_type" text DEFAULT 'pageview' NOT NULL,
        "visited_at" timestamp with time zone DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "portfolio_sections" (
        "id" text PRIMARY KEY NOT NULL,
        "portfolio_id" text NOT NULL REFERENCES "portfolios"("id") ON DELETE cascade,
        "section_key" text NOT NULL,
        "is_visible" boolean DEFAULT true,
        "display_order" integer DEFAULT 0
      );

      ALTER TABLE "portfolio_education" ADD COLUMN IF NOT EXISTS "mark" text;
      ALTER TABLE "portfolio_education" ADD COLUMN IF NOT EXISTS "location" text;
      ALTER TABLE "portfolio_experience" ADD COLUMN IF NOT EXISTS "location" text;
      ALTER TABLE "portfolio_skills" ADD COLUMN IF NOT EXISTS "level" text;
    `)
    console.log("Database schema verified and initialized.")
  } finally {
    client.release()
  }
}
