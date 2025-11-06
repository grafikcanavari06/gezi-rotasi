import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret"; // Vercel'de JWT_SECRET tanımlayabilirsin

type TokenPayload = {
  userId: string | number;
  email: string;
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
