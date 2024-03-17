import { RequestHandler } from "express";
import CustomError from "../config/error.config";
import { verifyUserToken } from "../auth/auth.utils";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header)
      throw new CustomError({
        status: "NOT_AUTHORIZED",
        message: "No Auth Header",
      });
    // split on bearer and decoded auth header access token
    const token = (header as string).split(" ")[1];
    const decoded = await verifyUserToken({ type: "ACCESS", payload: token });
    // set id and role on request object
    const { id, role } = decoded;
    (req as any).user = { id, role };
    next();
  } catch (error) {
    next(error);
  }
};

export const roleMiddleware: (role: "ADMIN" | "USER") => RequestHandler =
  (role) => async (req, res, next) => {
    try {
      if (!req.hasOwnProperty("user")) {
        throw new CustomError({
          status: "NOT_AUTHORIZED",
          message: "User Role Error",
        });
      }
      const requesterRole = (req as any)?.user?.role;
      if (role !== requesterRole)
        throw new CustomError({
          status: "NOT_AUTHORIZED",
          message: "User Role Error",
        });
      next();
    } catch (error) {
      next(error);
    }
  };
