import { Router } from "express";
import {
  getEventAnalytics,
  getEventsAnalytics,
} from "../../controllers/analytics.js";
import authorizeUser from "../../middlewares/authorizeUser.js";

const router = Router();

router.get("/event/:eventId", getEventAnalytics);
router.get("/user", authorizeUser, getEventsAnalytics);

export default router;
