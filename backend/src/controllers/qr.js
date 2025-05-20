import QrCode from "qrcode-svg";
import createResponse from "../lib/Response.js";

export function generateQrCode(req, res, next) {
  try {
    const { eventId } = req.params ?? {};
    const configuration = req.body.configuration ?? {};

    const qr = new QrCode({
      content: `${process.env.GUEST_JOIN_URL}/${eventId}`,
      ...configuration,
      width: 200,
      height: 200,
    });

    const svg = qr.svg();

    return res.json(
      createResponse(true, "QR code generated successfully", {
        svg,
      })
    );
  } catch (e) {
    next(e);
  }
}
