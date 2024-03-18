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
exports.deletePost = exports.getUserPosts = exports.createPost = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const user_model_1 = require("../models/user.model.js");
const post_model_1 = require("../models/post.model.js");
const errorHandler_1 = __importDefault(require("../utils/errorHandler.js"));
const catchAsyncError_1 = require("../middleware/catchAsyncError.js");
const createPost = (req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.file) {
      return next(new errorHandler_1.default("Please enter image file", 400));
    }
    if (!req.body.title) {
      return next(new errorHandler_1.default("Please enter post title", 400));
    }
    const myCloud = yield cloudinary_1.default.v2.uploader.upload(
      req.file.path,
      {
        folder: "gallery",
      }
    );
    const newPostData = {
      title: req.body.title,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
    };
    if (!newPostData.owner) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }
    const newPost = yield post_model_1.Post.create(newPostData);
    const user = yield user_model_1.User.findById(
      (_b = req.user) === null || _b === void 0 ? void 0 : _b._id
    );
    if (user) {
      user.posts.unshift(newPost._id);
      yield user.save();
    }
    return res.status(201).json({
      success: true,
      message: "Post created.",
    });
  });
exports.createPost = createPost;
exports.getUserPosts = (0, catchAsyncError_1.catchAsyncError)(
  (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      var _c;
      const user = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
      const posts = yield post_model_1.Post.find({ owner: user });
      return res.status(200).json(posts);
    })
);
exports.deletePost = (0, catchAsyncError_1.catchAsyncError)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { pId } = req.params;
    if (!pId)
      return next(new errorHandler_1.default("Please provide post id", 400));
    const post = yield post_model_1.Post.findById(pId);
    if (!post)
      return next(
        new errorHandler_1.default("Post not found with given id", 404)
      );
    if (
      post.owner.toString() !==
      ((_d = req.user) === null || _d === void 0 ? void 0 : _d._id.toString())
    ) {
      return next(new errorHandler_1.default("Unauthorised", 401));
    }
    // Remove post from db
    yield post.deleteOne();
    // Remove post from user's posts array
    const user = req.user;
    if (user) {
      const indexOfPostId =
        user === null || user === void 0 ? void 0 : user.posts.indexOf(pId);
      user.posts.splice(indexOfPostId, 1);
      yield user.save();
    }
    // Destory post from cloudinary
    yield cloudinary_1.default.v2.uploader.destroy(post.image.public_id);
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  })
);
