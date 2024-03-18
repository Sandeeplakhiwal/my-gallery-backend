import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { createPost, deletePost, getUserPosts } from "./post.controller";
import multer from "multer";

const router = express.Router();

// Setting up multer middlware to handle file upload
const upload = multer({ dest: "uploads/" });

router.post(
  "/post/create",
  isAuthenticated,
  upload.single("image"),
  createPost
);
router.get("/posts", isAuthenticated, getUserPosts);
router.delete("/post/:pId", isAuthenticated, deletePost);

export default router;
