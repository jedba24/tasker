import { Router } from "express";
import * as authController from "./auth.controllers";
import { valMiddleware } from "../middleware/val.middleware";
import { userLoginModel, userRegisterModel } from "./auth.models";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";
// Post / - Register User, Post /login - Login User, Get / - Refresh User, Get /logoff - Sign Out User

export const authRouter = Router();
authRouter
  .post(
    "/",
    valMiddleware(userRegisterModel),
    authController.registerUserHandler
  )
  .post(
    "/login",
    valMiddleware(userLoginModel),
    authController.loginUserHandler
  )
  .get("/", authController.refreshUserHandler)
  .get("/logoff", authController.logOffUserHandler)
  .get("/test", authMiddleware, (req, res, next) => {
    return res.status(200).json({ message: "Super Secret Shit Here" });
  })
  .get("/admin", authMiddleware, roleMiddleware("ADMIN"), (req, res, next) => {
    return res
      .status(200)
      .json({ message: "Super Secret Admin Only Shit Here" });
  });
