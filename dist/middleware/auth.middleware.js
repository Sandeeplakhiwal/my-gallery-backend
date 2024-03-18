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
exports.isAuthenticated = void 0;
const catchAsyncError_1 = require("./catchAsyncError.js");
const errorHandler_1 = __importDefault(require("../utils/errorHandler.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model.js");
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)(
  (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      var _a;
      const token =
        (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
      if (!token) return next(new errorHandler_1.default("Not Logged In", 401));
      const decoded = jsonwebtoken_1.default.verify(
        token,
        `${process.env.JWT_SECRET}`
      );
      req.user = yield user_model_1.User.findById(decoded._id);
      next();
    })
);
