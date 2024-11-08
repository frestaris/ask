import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://www.practiceportuguese.com/cdn-cgi/image/width=800,height=534,/wp-content/uploads/2020/06/asking-questions.jpg",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
