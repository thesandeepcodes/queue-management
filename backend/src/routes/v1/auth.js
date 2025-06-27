import { Router } from "express";
import authorizeUser from "../../middlewares/authorizeUser.js";

import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
} from "../../controllers/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authorizeUser, getUser);
router.put("/update", authorizeUser, updateUser);

export default router;
