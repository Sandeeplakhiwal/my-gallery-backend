var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import Validator from "validator";
import { hash, compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [50, "Name cannot exceed 50 character"],
        minLength: [3, "Name should have at least two character"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [Validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        maxLength: [30, "Password cannot exceed 50 characters"],
        minLength: [6, "Password should have at least 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            //   required: true,
        },
        url: {
            type: String,
            //   required: true,
        },
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
});
// Hashing password before saving into database
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = yield hash(this.password, 10);
        next();
    });
});
// Generate JWT token
userSchema.methods.generateToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        return jwt.sign({ _id: this._id }, `${process.env.JWT_SECRET}`, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    });
};
// Comparing user password
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield compare(password, this.password);
    });
};
export const User = mongoose.model("User", userSchema);
