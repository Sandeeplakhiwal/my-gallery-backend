"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const app = (0, express_1.default)();
dotenv_1.default.config({
  path: "src/config/.env",
});
// Using middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(
  (0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});
// Connecting to the databse
(0, db_1.connectDB)();
// Configuring Cloudinary
cloudinary_1.default.v2.config({
  cloud_name: process.env.CLD_NAME,
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET,
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Importing routes
const auth_routes_1 = __importDefault(require("./auth/auth.routes.js"));
const error_1 = __importDefault(require("./middleware/error.js"));
const post_routes_1 = __importDefault(require("./post/post.routes.js"));
// Using routes
app.use("/api/v1", auth_routes_1.default);
app.use("/api/v1", post_routes_1.default);
// Using middleware for exception handling
app.use(error_1.default);
const server = app.listen(process.env.PORT, () => {
  return console.log(
    `Express is listening at http://localhost:${process.env.PORT}`
  );
});
process.on("unhandledRejection", (err) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
