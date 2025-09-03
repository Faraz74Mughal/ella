import mongoose, { Schema } from 'mongoose';
import { IExercise } from '../interface/exerciseInterface';
import { ECategory, ELevel } from '../interface/lessonInterface';

const collectionName = 'Exercise';

const schema = new Schema<IExercise>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    attemptsAllowed: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    totalTime: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: Object.values(ELevel),
      required: [true, 'Level is required'],
    },
    category: {
      type: String,
      enum: Object.values(ECategory),
      required: [true, 'Category is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  },

  {
    timestamps: true,
  }
);

export const Exercise = mongoose.model<IExercise>(collectionName, schema);
