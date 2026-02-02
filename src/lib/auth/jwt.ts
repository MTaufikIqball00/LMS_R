import "server-only";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
