import { Router } from "express";
import {
  deleteNotification,
  getNotifications,
  pushNotification,
  updateNotification,
} from "../../controllers/notifications.js";
import authorizeUser from "../../middlewares/authorizeUser.js";

const router = Router();

router.get("/:eventId", getNotifications);
router.post("/:eventId", authorizeUser, pushNotification);
router.put("/:notificationId", authorizeUser, updateNotification);
router.delete("/:notificationId", authorizeUser, deleteNotification);

export default router;
