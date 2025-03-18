import express from "express";
import v1Routes from "./src/routes/v1/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is a Queue Management API. Visit /v1 for more details");
});

app.use("/v1", v1Routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
