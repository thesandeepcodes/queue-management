import { Router } from "express";
import { ZodError } from "zod";
import { parseZodError } from "../../lib/apiHelpers.js";
import createResponse from "../../lib/Response.js";
import HTTP from "../../lib/HTTP.js";
import AppError from "../../errors/AppError.js";

import authRoutes from "./auth.js";
import eventRoutes from "./events.js";
import qrRoutes from "./qr.js";
import guestRoutes from "./guests.js";
import queueRoutes from "./queue.js";
import notificationRoutes from "./notifications.js";
import analyticRoutes from "./analytics.js";

import authorizeUser from "../../middlewares/authorizeUser.js";

const v1Routes = Router();

// Home (v1) route
v1Routes.get("/", (req, res) => {
  return res.json(
    createResponse(true, "Welcome to the Queue Management API(v1)", undefined)
  );
});

// Routes
v1Routes.use("/auth", authRoutes);
v1Routes.use("/events", authorizeUser, eventRoutes);
v1Routes.use("/qr", qrRoutes);
v1Routes.use("/guests", guestRoutes);
v1Routes.use("/queue", queueRoutes);
v1Routes.use("/notifications", notificationRoutes);
v1Routes.use("/analytics", analyticRoutes);

// Global error handler
// If the error is a ZodError, return a validation error
// If the error is an AppError, return the error
// Otherwise, pass the error to the next middleware
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
