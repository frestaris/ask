import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import questionRoutes from "./routes/question.route.js";
import cookieParser from "cookie-parser";
import commentRoutes from "./routes/comment.route.js";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const app = express();

app.use(
  cors({
    origin: "https://ask-frontend-virid.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
