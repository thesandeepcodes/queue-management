import express from "express";
import v1Routes from "./src/routes/v1/index.js";
import HTTP from "./src/utils/HTTP.js";
import createResponse from "./src/utils/Response.js";
import { config } from "dotenv";
import connectDB from "./src/config/db.js";

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is a Queue Management API. Visit /v1 to get started.");
});

app.use("/v1", v1Routes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  return res
    .status(HTTP.INTERNAL_SERVER_ERROR)
    .json(createResponse(false, "Internal Server Error"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
