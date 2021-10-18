-- initiate the table
CREATE TABLE "tasklist"
    ("id" SERIAL PRIMARY KEY,
    "task" VARCHAR(255) NOT NULL,
    "is_complete" BOOLEAN DEFAULT false,
    "time_completed" TIMESTAMP WITH TIME ZONE);

-- creates a function that will set the time_completed column in a given row to the current timestamp
-- this will enable us to get the time that a task is marked as complete
CREATE OR REPLACE FUNCTION update_time_completed_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.time_completed = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- triggers the function update_time_completed_column() when is_complete is updated to 'true'
CREATE TRIGGER update_tasklist_time_completed 
BEFORE UPDATE OF "is_complete" ON "tasklist"
FOR EACH ROW
WHEN (NEW.is_complete = true)
EXECUTE PROCEDURE update_time_completed_column();

-- creates a function to set time_completed to NULL in the case that is_complete is updated to 'false'
CREATE OR REPLACE FUNCTION remove_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tasklist SET time_completed = NULL WHERE is_complete = FALSE;
    RETURN NEW;
END
$$
LANGUAGE 'plpgsql';

-- trigers remove_timestamp() when is_complete is updated to 'false'
CREATE TRIGGER remove_tasklist_time_completed 
AFTER UPDATE OF "is_complete" ON "tasklist"
FOR EACH ROW
WHEN (NEW.is_complete = false)
EXECUTE PROCEDURE remove_timestamp();

-- based on function and trigger found on https://stackoverflow.com/questions/1035980/update-timestamp-when-row-is-updated-in-postgresql