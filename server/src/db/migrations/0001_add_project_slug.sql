-- Hand-edited after `drizzle-kit generate`: a plain "ADD COLUMN ... NOT NULL"
-- fails on a table that already has rows, so we add the column as nullable,
-- backfill a unique slug from each project's name, then enforce the constraints.
ALTER TABLE "projects" ADD COLUMN "slug" varchar(120);--> statement-breakpoint
UPDATE "projects" AS p
SET "slug" = s."slug"
FROM (
  SELECT
    b."id",
    b."base" || CASE
      WHEN ROW_NUMBER() OVER (PARTITION BY b."base" ORDER BY b."created_at", b."id") > 1
        THEN '-' || ROW_NUMBER() OVER (PARTITION BY b."base" ORDER BY b."created_at", b."id")
      ELSE ''
    END AS "slug"
  FROM (
    SELECT
      "id",
      "created_at",
      COALESCE(
        NULLIF(TRIM(BOTH '-' FROM LEFT(LOWER(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g')), 110)), ''),
        'project'
      ) AS "base"
    FROM "projects"
  ) AS b
) AS s
WHERE p."id" = s."id";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_slug_unique" UNIQUE("slug");

