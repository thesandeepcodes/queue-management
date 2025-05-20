import { Router } from "express";
import authorizeUser from "../../middlewares/authorizeUser.js";

import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
} from "../../controllers/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/me", authorizeUser, getUser);
router.put("/update", authorizeUser, updateUser);

export default router;
