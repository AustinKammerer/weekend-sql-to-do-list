// import pg from node_modules
const pg = require("pg");

// set up pg to connect to the database
const config = {
  database: "weekend-to-do-app",
  host: "localhost",
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};
const pool = new pg.Pool(config);

// server terminal logs on connection success/failure
pool.on("connect", () => {
  console.log("connected to database");
});
pool.on("error", (err) => {
  console.log("error connecting to database", err);
});

// export the module for router
module.exports = pool;
