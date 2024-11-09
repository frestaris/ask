import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getQuestions } from "../controllers/question.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getquestions", getQuestions);
export default router;
