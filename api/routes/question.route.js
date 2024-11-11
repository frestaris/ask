import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getQuestions,
  deleteQuestion,
  updateQuestion,
  getUserQuestions,
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getquestions", getQuestions);
router.delete(
  "/deletequestion/:questionId/:userId",
  verifyToken,
  deleteQuestion
);
router.put("/updatequestion/:questionId/:userId", verifyToken, updateQuestion);
router.get("/currentuser/:userId", verifyToken, getUserQuestions);

export default router;
