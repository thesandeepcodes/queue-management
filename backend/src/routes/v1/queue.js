import { Router } from "express";
import {
  deleteQueue,
  getQueue,
  moveQueue,
  serveQueue,
} from "../../controllers/queue.js";

const router = Router();

router.get("/event/:eventId", getQueue);
router.put("/move/:eventId", moveQueue);
router.put("/serve/:eventId", serveQueue);
router.delete("/remove/:guestId", deleteQueue);

export default router;
