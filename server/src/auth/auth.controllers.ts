import { RequestHandler } from "express";
import { UserLoginModel, UserRegisterModel } from "./auth.models";
import { db } from "../config/db.config";
import CustomError from "../config/error.config";
import argon from "argon2";
import { signUserTokens, verifyUserToken } from "./auth.utils";
import { cookieConfig } from "../config/cookie.config";

export const registerUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, ...restOfBody } = req.body as UserRegisterModel;
    const foundUser = await db.user.findUnique({ where: { email } });
    //Check if user exists
    if (foundUser)
      throw new CustomError({
        status: "BAD_REQUEST",
        message: "Check Your Input",
      });
    // hash password
    const hashedPass = await argon.hash(password);
    const newUser = await db.user.create({
      data: { ...restOfBody, passwordHash: hashedPass, email },
    });
    //sign tokens and set http only cookie for refresh
    const tokens = signUserTokens({ id: newUser.id, role: newUser.role });
    await db.user.update({
      where: { id: newUser.id },
      data: { refreshToken: tokens.refreshToken, lastLoginAt: new Date() },
    });
    res.cookie("refreshToken", tokens.refreshToken, { ...cookieConfig });
    const { passwordHash, refreshToken, avatarFileId, ...restOfNewUser } =
      newUser;
    // return user and access token
    return res
      .status(201)
      .json({ user: restOfNewUser, accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};

export const loginUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as UserLoginModel;
    const foundUser = await db.user.findUnique({ where: { email } });
    //Check if user exists
    if (!foundUser)
      throw new CustomError({
        status: "BAD_REQUEST",
        message: "Check Your Input",
      });
    // check password
    const isValid = await argon.verify(foundUser.passwordHash, password);
    if (!isValid)
      throw new CustomError({
        status: "NOT_AUTHORIZED",
        message: "Email or Password Incorrect",
      });
    //sign tokens and set http only cookie for refresh
    const tokens = signUserTokens({ id: foundUser.id, role: foundUser.role });
    await db.user.update({
      where: { id: foundUser.id },
      data: { refreshToken: tokens.refreshToken, lastLoginAt: new Date() },
    });
    res.cookie("refreshToken", tokens.refreshToken, { ...cookieConfig });
    const { passwordHash, refreshToken, avatarFileId, ...restOfUser } =
      foundUser;
    // return user and access token
    return res
      .status(200)
      .json({ user: restOfUser, accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
};

export const refreshUserHandler: RequestHandler = async (req, res, next) => {
  try {
    // get refresh token and decode
    const token = req.cookies.refreshToken;
    if (!token)
      throw new CustomError({
        status: "NOT_AUTHORIZED",
        message: "Token Not Provided",
      });
    const decoded = await verifyUserToken({ type: "REFRESH", payload: token });
    const { id } = decoded;
    // find user
    const foundUser = await db.user.findUnique({ where: { id } });
    if (!foundUser)
      throw new CustomError({
        status: "FORBIDDEN",
        message: "Invalid Token",
      });
    const { passwordHash, refreshToken, avatarFileId, ...restOfUser } =
      foundUser;
    const accessToken = signUserTokens({
      id: foundUser.id,
      role: foundUser.role,
    }).accessToken;
    return res.status(200).json({ user: restOfUser, accessToken });
  } catch (error) {
    next(error);
  }
};

export const logOffUserHandler: RequestHandler = async (req, res, next) => {
  try {
    // get refresh token and decode
    const token = req.cookies.refreshToken;
    if (!token) return res.status(200).json({ message: "Logged Out" });
    const { id } = await verifyUserToken({ type: "REFRESH", payload: token });
    // find user
    const foundUser = await db.user.findUnique({ where: { id } });
    if (!foundUser) return res.status(200).json({ message: "Logged Out" });
    // clear token in DB
    await db.user.update({ where: { id }, data: { refreshToken: null } });
    return res.status(200).json({ message: "Logged Out" });
  } catch (error) {
    next(error);
  }
};
