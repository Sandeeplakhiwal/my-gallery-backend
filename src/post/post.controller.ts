import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import { IUser, User } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { Post } from "../models/post.model";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";

export const createPost = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(new ErrorHandler("Please enter image file", 400));
  }
  if (!req.body.title) {
    return next(new ErrorHandler("Please enter post title", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: "gallery",
  });

  const newPostData = {
    title: req.body.title,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    owner: req.user?._id,
  };

  if (!newPostData.owner) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized. User not found.",
    });
  }

  const newPost = await Post.create(newPostData);

  const user = await User.findById(req.user?._id);
  if (user) {
    user.posts.unshift(newPost._id);
    await user.save();
  }

  return res.status(201).json({
    success: true,
    message: "Post created.",
  });
};

export const getUserPosts = catchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user?._id;
    const posts = await Post.find({ owner: user });
    return res.status(200).json(posts);
  }
);

export const deletePost = catchAsyncError(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { pId } = req.params;
    if (!pId) return next(new ErrorHandler("Please provide post id", 400));
    const post = await Post.findById(pId);
    if (!post)
      return next(new ErrorHandler("Post not found with given id", 404));
    if (post.owner.toString() !== req.user?._id.toString()) {
      return next(new ErrorHandler("Unauthorised", 401));
    }
    // Remove post from db
    await post.deleteOne();

    // Remove post from user's posts array
    const user = req.user;
    if (user) {
      const indexOfPostId: number = user?.posts.indexOf(pId);
      user.posts.splice(indexOfPostId, 1);
      await user.save();
    }

    // Destory post from cloudinary
    await cloudinary.v2.uploader.destroy(post.image.public_id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  }
);
