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
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const isAuthenticated = catchAsyncError((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token =
      (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) return next(new ErrorHandler("Not Logged In", 401));
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    req.user = yield User.findById(decoded._id);
    next();
  })
);
