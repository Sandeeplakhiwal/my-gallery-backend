import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, IUser } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: IUser | null;
}

export const isAuthenticated = catchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) return next(new ErrorHandler("Not Logged In", 401));
    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`
    ) as JwtPayload;
    req.user = await User.findById(decoded._id);
    next();
  }
);
