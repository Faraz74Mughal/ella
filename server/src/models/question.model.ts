import mongoose, { Schema } from 'mongoose';
import { ECategory, ELevel, ILesson } from '../interface/lessonInterface';
import {
  EGrammer,
  EListening,
  ESpeaking,
  EType,
  EWriting,
  IQuestion,
} from '../interface/exerciseInterface';

const collectionName = 'Question';

const schema = new Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: Object.values(EType),
      required: [true, 'Type is required'],
    },
    subType: {
      type: String,
      enum: [
        ...Object.values(EGrammer),
        ...Object.values(ESpeaking),
        ...Object.values(EWriting),
        ...Object.values(EListening),
      ],
      required: [true, 'Sub type is required'],
    },
    question: {
      type: String,
      trim: true,
      required: [true, 'Question type is required'],
    },
    options: [
      {
        type: String,
        trim: true,
      },
    ],
    answer: {
      type: String,
      trim: true,
    },
    maxWord: {
      type: Number,
    },
    mark: {
      type: Number,
    },
    time: {
      type: Number,
    },
    exercise: {
      string: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
    },
  },

  {
    timestamps: true,
  }
);

export const Question = mongoose.model<IQuestion>(collectionName, schema);
