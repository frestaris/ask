import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getQuestionComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getQuestionComments/:questionId", getQuestionComments);

export default router;
