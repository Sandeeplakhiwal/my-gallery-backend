import { Response } from "express";
import { IUser } from "../models/user.model"; // Replace "your-user-model-file" with the actual file name where IUser is defined
import { CookieOptions } from "express";

export const sendToken = async (
  res: Response,
  user: IUser,
  message: string,
  statusCode: number = 200
): Promise<void> => {
  const token = await user.generateToken();
  const options: CookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() +
        parseInt(`${process.env.COOKIE_EXPIRE}`) * 24 * 60 * 60 * 1000
    ),
    secure: true,
    sameSite: "none",
  };
  res.cookie("token", token, options).status(statusCode).json({
    success: true,
    message,
    user,
  });
};
