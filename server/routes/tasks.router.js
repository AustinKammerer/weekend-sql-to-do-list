// import express and set up a router
const express = require("express");
const router = express.Router();

// import pg to query the database
const pool = require("../modules/pool.js");

// '/tasks' GET request handler
router.get("/", (req, res) => {
  console.log("GET request at", req.url);
  let queryText = `
    SELECT * FROM "tasklist"
    ORDER BY "id";
    `;
  pool
    .query(queryText)
    .then((result) => {
      console.log(result.rows);
      res.send(result.rows);
    })
    .catch((err) => {
      console.log("error getting results from database:", err);
      res.sendStatus(500);
    });
});

// export the router for server
module.exports = router;
