CREATE TABLE "tasklist"
    ("id" SERIAL PRIMARY KEY,
    "task" VARCHAR(255) NOT NULL,
    "is_complete" BOOLEAN DEFAULT false,
    "time_completed" TIMESTAMP);


-- trigger for time_completed found on https://stackoverflow.com/questions/1035980/update-timestamp-when-row-is-updated-in-postgresql
-- creates a function that will set the time_completed column in a given row to the current timestamp
CREATE OR REPLACE FUNCTION update_time_completed_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.time_completed = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- creates a trigger that will trigger the function when a column in the given row is updated
CREATE TRIGGER update_tasklist_time_completed BEFORE UPDATE
    ON "tasklist" FOR EACH ROW EXECUTE PROCEDURE 
    update_time_completed_column();

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