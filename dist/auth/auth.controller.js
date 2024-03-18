"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile =
  exports.Logout =
  exports.Login =
  exports.Signup =
    void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError.js");
const errorHandler_1 = __importDefault(require("../utils/errorHandler.js"));
const user_model_1 = require("../models/user.model.js");
const sendToken_1 = require("../utils/sendToken.js");
exports.Signup = (0, catchAsyncError_1.catchAsyncError)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new errorHandler_1.default("Please enter all fields", 400));
    }
    let user = yield user_model_1.User.findOne({ email });
    if (user) {
      return next(
        new errorHandler_1.default(
          "User already exist with this email address",
          409
        )
      );
    }
    user = yield user_model_1.User.create({
      name,
      email,
      password,
    });
    return (0,
    sendToken_1.sendToken)(res, user, "Registered successfully", 201);
  })
);
// Login Controller
exports.Login = (0, catchAsyncError_1.catchAsyncError)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new errorHandler_1.default("Please enter all fields", 400));
    }
    let user = yield user_model_1.User.findOne({ email }).select("+password");
    if (!user) {
      return next(
        new errorHandler_1.default("Incorrect email or password", 401)
      );
    }
    const isMatch = yield user.comparePassword(password);
    if (!isMatch) {
      return next(
        new errorHandler_1.default("Incorrect email or password", 401)
      );
    }
    return (0,
    sendToken_1.sendToken)(res, user, `Welcome back ${user.name}`, 200);
  })
);
// Logout Controller
exports.Logout = (0, catchAsyncError_1.catchAsyncError)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  })
);
// Get User Profile
exports.getUserProfile = (0, catchAsyncError_1.catchAsyncError)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(
      (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
    ).populate("posts");
    return res.status(200).json(user);
  })
);
