"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller.js");
const auth_middleware_1 = require("../middleware/auth.middleware.js");
const Router = express_1.default.Router();
Router.post("/auth/register", auth_controller_1.Signup);
Router.post("/auth/login", auth_controller_1.Login);
Router.get("/auth/logout", auth_controller_1.Logout);
Router.get(
  "/me",
  auth_middleware_1.isAuthenticated,
  auth_controller_1.getUserProfile
);
exports.default = Router;
