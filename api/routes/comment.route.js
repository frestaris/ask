import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  getQuestionComments,
  likeComment,
  editComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getQuestionComments/:questionId", getQuestionComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);

export default router;
