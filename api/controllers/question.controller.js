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
