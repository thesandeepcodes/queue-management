import { Router } from "express";
import createResponse from "../../utils/Response.js";
import authRoutes from "./auth.js";

const v1Routes = Router();

v1Routes.get("/", (req, res) => {
  return res.send(
    createResponse(true, "Welcome to the Queue Management API(v1)", undefined)
  );
});

v1Routes.use("/auth", authRoutes);

export default v1Routes;
