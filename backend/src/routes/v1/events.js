import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent,
} from "../../controllers/events.js";

const router = Router();

router.get("/", getEvents);
router.post("/create", createEvent);
router.get("/:eventId", getEvent);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);

export default router;
