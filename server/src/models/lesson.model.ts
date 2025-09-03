import mongoose, { Document, Schema } from 'mongoose';
import { ECategory, ELevel, ILesson } from '../interface/lessonInterface';
import mongoosePaginate from 'mongoose-paginate-v2';

const collectionName = 'Lesson';

const schema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
    },
    level: {
      type: String,
      enum: Object.values(ELevel),
      required: [true, 'Level is required.'],
    },
    category: {
      type: String,
      enum: Object.values(ECategory),
      required: [true, 'Category is required.'],
    },
    order: {
      type: Number,
      required: [true, 'Order is required.'],
      unique:[true,"Order must be unique."]
    },
    multimedia: [
      {
        videos: [{ type: String }],
        audios: [{ type: String }],
        images: [{ type: String }],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       required: [true, 'Created by is required.'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
      },
    ],
  },

  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate)

export interface IModel <T extends Document> extends mongoose.PaginateModel<T>{}

export const LessonModel = mongoose.model<ILesson,IModel<ILesson>>(collectionName, schema);
