CREATE TABLE "tasklist"
    ("id" SERIAL PRIMARY KEY,
    "task" VARCHAR(255) NOT NULL,
    "is_complete" BOOLEAN DEFAULT false;

-- REFERENCE:

-- SELECT * FROM "tasklist"
-- ORDER BY "column"

-- INSERT INTO "tasklist" ("task", "is_complete")
-- VALUES;

-- DELETE FROM "tasklist"
-- WHERE "id" = ##

-- UPDATE "tasklist"
-- SET "is_complete" = TRUE
-- WHERE "id" = ##