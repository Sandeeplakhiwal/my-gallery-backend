"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware.js");
const post_controller_1 = require("./post.controller.js");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
// Setting up multer middlware to handle file upload
const upload = (0, multer_1.default)({ dest: "uploads/" });
router.post(
  "/post/create",
  auth_middleware_1.isAuthenticated,
  upload.single("image"),
  post_controller_1.createPost
);
router.get(
  "/posts",
  auth_middleware_1.isAuthenticated,
  post_controller_1.getUserPosts
);
router.delete(
  "/post/:pId",
  auth_middleware_1.isAuthenticated,
  post_controller_1.deletePost
);
exports.default = router;
