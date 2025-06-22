"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUser() {
  const cookieData = await cookies();

  const cookieName =
    process.env.NODE_ENV == "production" ? "__Secure-Token" : "_Secure-Token";

  const token = cookieData.get(cookieName);

  if (!token) return null;

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}
