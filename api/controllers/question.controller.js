import { errorHandler } from "../utils/error.js";
import Question from "../models/question.model.js";

export const create = async (req, res, next) => {
  console.log(req.body);
  if (!req.user) {
    return next(
      errorHandler(401, "You must be logged in to create a question")
    );
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-z0-9-]/g, "");

  const newQuestion = new Question({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error saving question:", error);
    next(error);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const questions = await Question.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { userId: req.query.slug }),
      ...(req.query.questionsId && { _id: req.query.questionsId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $option: "i" } },
          { content: { $regex: req.query.searchTerm, $option: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalQuestions = await Question.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const lastMonthQuestions = await Question.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      questions,
      totalQuestions,
      lastMonthQuestions,
    });
  } catch (error) {
    console.error("Error getting questions:", error);
    next(error);
  }
};
