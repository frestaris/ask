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
      // ...(req.query.userId && { userId: req.query.userId }),
      // ...(req.query.category && { category: req.query.category }),
      // ...(req.query.slug && { slug: req.query.slug }),
      // ...(req.query.postId && { _id: req.query.postId }),
      // ...(req.query.searchTerm && {
      //   $or: [
      //     { title: { $regex: req.query.searchTerm, $option: "i" } },
      //     { content: { $regex: req.query.searchTerm, $option: "i" } },
      //   ],
      // }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate("userId", "username profilePicture");

    const totalQuestions = await Question.countDocuments();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
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

export const deleteQuestion = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this question")
    );
  }
  try {
    await Question.findByIdAndDelete(req.params.questionId);
    res.status(200).json("The question has been deleted");
  } catch (error) {
    console.log(error.message);
  }
};

export const updateQuestion = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to update this question")
    );
  }
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.questionId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedQuestion);
  } catch (error) {
    next(error);
  }
};
