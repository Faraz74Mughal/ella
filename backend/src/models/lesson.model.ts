import mongoose, { Model, Schema } from "mongoose";
import {
	CATEGORY,
	LEVEL,
	STUDY_MATERIAL_TYPE,
} from "../constants/lesson.constant";
import { ILesson } from "../types/lesson.type";

const lessonSchema = new Schema<ILesson>(
	{
		title: {
			type: String,
			required: [true, "Lesson title is required"],
			trim: true,
		},
		level: {
			type: String,
			enum: Object.values(LEVEL),
			required: true,
			index: true,
		},
		category: {
			type: String,
			enum: Object.values(CATEGORY),
			required: true,
			index: true,
		},
		study_material: {
			material_type: {
				type: String,
				enum: Object.values(STUDY_MATERIAL_TYPE),
			},
			content: {
				type: String,
			},
		},
		sequence_order: {
			type: Number,
			required: true,
			min: [1, "sequence_order must be at least 1"],
			unique: true,
			index: true,
		},
		is_published: {
			type: Boolean,
			default: false,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

export const Lesson = mongoose.model<ILesson, Model<ILesson>>(
	"Lesson",
	lessonSchema,
);
