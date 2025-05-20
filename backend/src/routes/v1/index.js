import { Router } from "express";
import createResponse from "../../lib/Response.js";
import authRoutes from "./auth.js";
import { ZodError } from "zod";
import HTTP from "../../lib/HTTP.js";
import { parseZodError } from "../../lib/apiHelpers.js";
import AppError from "../../errors/AppError.js";

const v1Routes = Router();

v1Routes.get("/", (req, res) => {
  return res.json(
    createResponse(true, "Welcome to the Queue Management API(v1)", undefined)
  );
});

v1Routes.use("/auth", authRoutes);

v1Routes.use((error, req, res, next) => {
  if (error instanceof ZodError) {
    return res
      .status(HTTP.BAD_REQUEST)
      .json(createResponse(false, "Validation Error", parseZodError(error)));
  } else if (error instanceof AppError) {
    return res.status(error.statusCode).json(error.errorInfo);
  }

  next(error);
});

export default v1Routes;
