import express from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
} from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authController = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc clear the token from the cookie and add it to the blacklist
 * @access Public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get the current user information
 * @access Private
 */
authRouter.get("/get-me", authUser, authController.getMeController);

export default authRouter;