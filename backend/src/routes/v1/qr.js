import { Router } from "express";
import { generateQrCode } from "../../controllers/qr.js";

const router = Router();

router.get("/generate/:eventId", generateQrCode);

export default router;
