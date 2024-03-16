import { Router } from "express";

// Post / - Register User, Post /login - Login User, Get / - Refresh User, Get /logoff - Sign Out User

export const authRouter = Router();
authRouter.post("/").post("/login").get("/").get("/logoff");
