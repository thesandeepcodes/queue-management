import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent,
} from "../../controllers/events.js";
import authorizeUser from "../../middlewares/authorizeUser.js";

const router = Router();

router.get("/", authorizeUser, getEvents);
router.post("/create", authorizeUser, createEvent);
router.get("/:eventId", getEvent);
router.put("/:eventId", authorizeUser, updateEvent);
router.delete("/:eventId", authorizeUser, deleteEvent);

export default router;
