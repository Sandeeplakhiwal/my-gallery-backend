import express from "express";
import { Login, Logout, Signup, getUserProfile } from "./auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
const Router = express.Router();
Router.post("/auth/register", Signup);
Router.post("/auth/login", Login);
Router.get("/auth/logout", Logout);
Router.get("/me", isAuthenticated, getUserProfile);
export default Router;
