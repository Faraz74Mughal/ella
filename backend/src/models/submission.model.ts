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
      ref: "Exercise",
      required: true,
    },
    category: {
      type: String, 
      enum: ["grammar", "vocabulary", "listening", "speaking", "writing"],
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
    points_earned: {
      type: Number,
      default: 0,
    },
    xp_earned: {
      type: Number,
      default: 0,
    },
    rewards_applied: {
      type: Boolean,
      default: false,
    },
    // Saves exactly what the student submitted
    submitted_payload: {
      type: Schema.Types.Mixed,
      default: {},
    }
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);