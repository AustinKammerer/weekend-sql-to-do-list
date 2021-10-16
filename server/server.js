// imports
const express = require("express");
const bodyParser = require("body-parser");
const tasksRouter = require("./routes/tasks.router.js");

// set up express app
const app = express();

// serve the static files
app.use(express.static("server/public"));

// set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up the router for when '/tasks' is hit
app.use("/tasks", tasksRouter);

// start the express server on PORT 5000 or the environment's choice
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
