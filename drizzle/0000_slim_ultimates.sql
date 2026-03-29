CREATE TYPE "public"."category" AS ENUM('Cliente', 'Producto', 'Admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('TODO', 'TODAY', 'DONE', 'BLOCKED');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"status" "status" DEFAULT 'TODO' NOT NULL,
	"category" "category" DEFAULT 'Producto' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"day_slot" varchar(10),
	"week_slot" varchar(8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "week_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"week_slot" varchar(8) NOT NULL,
	"intentions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "tasks_user_day_idx" ON "tasks" USING btree ("user_id","day_slot");--> statement-breakpoint
CREATE INDEX "tasks_user_week_idx" ON "tasks" USING btree ("user_id","week_slot");--> statement-breakpoint
CREATE UNIQUE INDEX "week_plans_user_week_idx" ON "week_plans" USING btree ("user_id","week_slot");