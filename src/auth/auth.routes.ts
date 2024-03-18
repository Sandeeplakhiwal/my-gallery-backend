import express from "express";
import { Login, Logout, Signup, getUserProfile } from "./auth.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const Router = express.Router();

Router.post("/auth/register", Signup);
Router.post("/auth/login", Login);
Router.get("/auth/logout", Logout);
Router.get("/me", isAuthenticated, getUserProfile);

export default Router;
