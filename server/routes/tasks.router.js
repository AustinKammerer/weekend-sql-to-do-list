// import express and set up a router
const express = require("express");
const router = express.Router();

// import pg to query the database
const pool = require("../modules/pool.js");

// '/tasks' GET request handler
router.get("/", (req, res) => {
  console.log(`GET request at ${req.baseUrl}${req.url}`);
  let queryText = `
    SELECT * FROM "tasklist"
    ORDER BY "id";`;
  pool
    .query(queryText)
    .then((result) => {
      console.log(result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log(`Error making query ${queryText}`, err);
      res.sendStatus(500);
    });
});

// '/tasks' POST request handler
router.post("/", (req, res) => {
  let newTask = req.body;
  console.log(`POST request at ${req.baseUrl}${req.url}`);
  console.log("request:", newTask);
  let queryText = `
    INSERT INTO "tasklist" ("task")
    VALUES ($1);`;
  let values = [];
  if (!newTask.task) {
    console.log(newTask.task);
    res.status(400).send({ msg: "Please Enter a Task" });
  } else {
    values = [newTask.task];
    pool
      .query(queryText, values)
      .then((result) => {
        res.sendStatus(201);
      })
      .catch((err) => {
        console.log(`Error making query ${queryText}, ${values}:`, err);
        res.sendStatus(500);
      });
  }
});

// '/tasks/:id' DELETE request handler
router.delete("/:id", (req, res) => {
  let id = req.params.id;
  console.log(`DELETE request at ${req.baseUrl}${req.url}`);
  let queryText = `
    DELETE FROM "tasklist"
    WHERE "id" = $1;`;
  let values = [id];
  pool
    .query(queryText, values)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(`Error making query ${queryText}, ${values}:`, err);
      res.sendStatus(500);
    });
});

// '/tasks/:id' PUT request handler
router.put("/:id", (req, res) => {
  let id = req.params.id;
  console.log(`PUT request at ${req.baseUrl}${req.url}`);
  let queryText = `
    UPDATE "tasklist"
    SET "is_complete" = TRUE
    WHERE "id" = $1;`;
  let values = [id];
  pool
    .query(queryText, values)
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(`Error making query ${queryText}, ${values}:`, err);
      res.sendStatus(500);
    });
});
// export the router for server
module.exports = router;
