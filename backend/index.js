import express from "express";
import v1Routes from "./src/routes/v1/index.js";
import HTTP from "./src/lib/HTTP.js";
import createResponse from "./src/lib/Response.js";
import { config } from "dotenv";
import connectDB from "./src/config/db.js";
import cors from "cors";

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  return res.json("This is a Queue Management API. Visit /v1 to get started.");
});

app.use("/v1", v1Routes);

app.use((err, req, res, next) => {
  return res
    .status(HTTP.INTERNAL_SERVER_ERROR)
    .json(createResponse(false, "Unexpected error occurred!"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
