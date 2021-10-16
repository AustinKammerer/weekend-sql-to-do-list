const express = require("express");
const app = express();
app.use(express.static("server/public"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
