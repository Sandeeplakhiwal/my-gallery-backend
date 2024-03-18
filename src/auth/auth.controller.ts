import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import { User } from "../models/user.model";
import { sendToken } from "../utils/sendToken";
import { AuthRequest } from "../middleware/auth.middleware";

export const Signup = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    let user = await User.findOne({ email });
    if (user) {
      return next(
        new ErrorHandler("User already exist with this email address", 409)
      );
    }
    user = await User.create({
      name,
      email,
      password,
    });
    return sendToken(res, user, "Registered successfully", 201);
  }
);

// Login Controller
export const Login = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Incorrect email or password", 401));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect email or password", 401));
    }
    return sendToken(res, user, `Welcome back ${user.name}`, 200);
  }
);

// Logout Controller
export const Logout = catchAsyncError(async (req: Request, res: Response) => {
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
});

// Get User Profile
export const getUserProfile = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?._id).populate("posts");
    return res.status(200).json(user);
  }
);
