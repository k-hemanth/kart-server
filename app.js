const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
process.on("uncaughtException", (e) => {
  console.error(`UncaughtException :: ${e}`);
});

dotenv.config();
const app = express();
let port = process.env.SERVER_PORT || 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api",routes)

app
  .listen(port, () => {
    console.log("Server listening on port " + port);
  })
  .on("error", (e) => console.log("Error while starting server: " + e));
