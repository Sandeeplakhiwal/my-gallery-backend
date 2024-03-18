import mongoose, { Document, Schema, Types } from "mongoose";
import Validator from "validator";
import { hash, compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { IPost } from "./post.model";

interface IAvatar {
  public_id: string;
  url: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: IAvatar;
  posts: string[];
  generateToken: () => Promise<string>;
  comparePassword: (password: string) => Promise<Boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
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
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hash(this.password, 10);
  next();
});

// Generate JWT token
userSchema.methods.generateToken = async function () {
  return jwt.sign({ _id: this._id }, `${process.env.JWT_SECRET}`, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Comparing user password
userSchema.methods.comparePassword = async function (password: string) {
  return await compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
