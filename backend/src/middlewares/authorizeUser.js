import jwt from "jsonwebtoken";
import AppError from "../errors/AppError.js";
import HTTP from "../lib/HTTP.js";
import createResponse from "../lib/Response.js";

export default function authorizeUser(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new AppError(
        HTTP.UNAUTHORIZED,
        createResponse(false, "Unauthorized: Authorization token is missing")
      );
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError(
        HTTP.UNAUTHORIZED,
        createResponse(false, "Unauthorized: Authorization token is missing")
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      next();
    } catch (error) {
      throw new AppError(
        HTTP.UNAUTHORIZED,
        createResponse(false, "Unauthorized: Invalid token"),
        error
      );
    }
  } catch (err) {
    next(err);
  }
}
