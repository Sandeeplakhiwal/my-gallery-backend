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
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import { sendToken } from "../utils/sendToken.js";
export const Signup = catchAsyncError((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    let user = yield User.findOne({ email });
    if (user) {
      return next(
        new ErrorHandler("User already exist with this email address", 409)
      );
    }
    user = yield User.create({
      name,
      email,
      password,
    });
    return sendToken(res, user, "Registered successfully", 201);
  })
);
// Login Controller
export const Login = catchAsyncError((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    let user = yield User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Incorrect email or password", 401));
    }
    const isMatch = yield user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect email or password", 401));
    }
    return sendToken(res, user, `Welcome back ${user.name}`, 200);
  })
);
// Logout Controller
export const Logout = catchAsyncError((req, res) =>
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
export const getUserProfile = catchAsyncError((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User.findById(
      (_a = req.user) === null || _a === void 0 ? void 0 : _a._id
    ).populate("posts");
    return res.status(200).json(user);
  })
);
