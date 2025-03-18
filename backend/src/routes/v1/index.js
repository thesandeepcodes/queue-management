import { Router } from "express";
import createResponse from "../../utils/Response.js";

const v1Routes = Router();

v1Routes.get("/", (req, res) => {
  return res.send(
    createResponse(true, "Welcome to the Queue Management API", undefined)
  );
});

export default v1Routes;
