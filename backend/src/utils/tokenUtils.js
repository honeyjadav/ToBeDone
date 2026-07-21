import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRY_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS || 30);

export const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

export const generateRefreshTokenString = (userId) =>
  jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d`,
  });

// Creates BOTH tokens, stores the session in DB, returns both
export const createSession = async (userId, req) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshTokenString(userId);

  const now = Date.now();

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    userAgent: req.headers["user-agent"] || "Unknown device",
    ip: req.ip || req.connection?.remoteAddress || "Unknown IP",
    accessTokenExpiresAt: new Date(now + ACCESS_TOKEN_EXPIRY_MS),
    refreshTokenExpiresAt: new Date(now + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken, session };
};

// Updates an existing session with a freshly rotated access token
export const rotateAccessToken = async (session) => {
  const newAccessToken = generateAccessToken(session.userId);
  session.accessToken = newAccessToken;
  session.accessTokenExpiresAt = new Date(Date.now() + ACCESS_TOKEN_EXPIRY_MS);
  session.lastUsedAt = new Date();
  await session.save();
  return newAccessToken;
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });
};