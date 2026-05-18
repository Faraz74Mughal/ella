const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubmissionSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lesson_id: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    exercise_id: {
      type: Schema.Types.ObjectId, // Connects to your speaking or writing quiz
      required: true,
    },
    category: {
      type: String, 
      enum: ["speaking", "writing"],
      required: true,
    },
    score_earned: {
      type: Number, // e.g., 21.5
      required: true,
    },
    max_score: {
      type: Number, 
      default: 25, // Always 25 as per your frontend specifications
    },
    percentage: {
      type: Number, // e.g., 86
      required: true,
    },
    is_passed: {
      type: Boolean,
      required: true,
    },
    // Saves exactly what the student submitted
    submitted_payload: {
      text_content: { type: String }, // Saved text or transcribed speech string
      issues_found: [{ type: String }], // Array of grammar/punctuation error strings
      critique: { type: String },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);