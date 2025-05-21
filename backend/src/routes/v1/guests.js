import { Router } from "express";
import { getQueue, joinQueue, leaveQueue } from "../../controllers/guests.js";

const router = Router();

router.get("/:guestId", getQueue);
router.post("/join/:eventId", joinQueue);
router.delete("/leave/:guestId", leaveQueue);

export default router;
