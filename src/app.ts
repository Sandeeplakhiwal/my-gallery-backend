import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import Cors from "cors";
import cloudinary from "cloudinary";

const app: Application = express();

dotenv.config({
  path: "src/config/.env",
});

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  Cors({
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
connectDB();

// Configuring Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLD_NAME,
  api_key: process.env.CLD_API_KEY,
  api_secret: process.env.CLD_API_SECRET,
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Importing routes
import AuthRoutes from "./auth/auth.routes";
import ErrorMiddleware from "./middleware/error";
import PostRoutes from "./post/post.routes";

// Using routes
app.use("/api/v1", AuthRoutes);
app.use("/api/v1", PostRoutes);

// Using middleware for exception handling
app.use(ErrorMiddleware);

const server = app.listen(process.env.PORT, () => {
  return console.log(
    `Express is listening at http://localhost:${process.env.PORT}`
  );
});

process.on("unhandledRejection", (err: any) => {
  console.log("Error: ", err.message);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
