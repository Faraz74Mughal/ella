// services/studentProgress.service.ts

import mongoose from "mongoose";
import { Lesson } from "../models/lesson.model";
import { StudentProgress } from "../models/studentProgress.model";

export class StudentProgressService {
	static async getStudentProgress(studentId: string) {
		let progress = await StudentProgress.findOne({
			student: studentId,
		});

		if (!progress) {
			progress = await StudentProgress.create({
				student: studentId,
				completed_lessons: [],
				total_points: 0,
			});
		}

		return progress;
	}

	static async getCurrentOpenSequence(studentId: string) {
		const progress =
			await this.getStudentProgress(studentId);

		if (
			progress.completed_lessons.length === 0
		) {
			return 1;
		}

		const highestCompleted =
			await Lesson.find({
				_id: {
					$in: progress.completed_lessons,
				},
			})
				.sort({
					sequence_order: -1,
				})
				.limit(1);

		return (
			(highestCompleted[0]
				?.sequence_order || 0) + 1
		);
	}

	static async getLessons(studentId: string) {
		const progress =
			await this.getStudentProgress(studentId);

		const currentSequence =
			await this.getCurrentOpenSequence(
				studentId,
			);

		// current + next 2 lessons
		const maxVisibleSequence =
			currentSequence + 2;

		const lessons = await Lesson.find({
			is_published: true,

			sequence_order: {
				$lte: maxVisibleSequence,
			},
		}).sort({
			sequence_order: 1,
		});

		return lessons.map((lesson) => {
			let status:
				| "completed"
				| "current"
				| "next" = "next";

			if (
				lesson.sequence_order <
				currentSequence
			) {
				status = "completed";
			} else if (
				lesson.sequence_order ===
				currentSequence
			) {
				status = "current";
			}

			return {
				...lesson.toObject(),

				status,
			};
		});
	}

	static async completeLesson(
		studentId: string,
		lessonId: string,
	) {
		const lesson =
			await Lesson.findById(lessonId);

		if (!lesson) {
			throw new Error(
				"Lesson not found",
			);
		}

		const progress =
			await this.getStudentProgress(
				studentId,
			);

		const alreadyCompleted =
			progress.completed_lessons.some(
				(id) =>
					id.toString() === lessonId,
			);

		if (!alreadyCompleted) {
			progress.completed_lessons.push(
				new mongoose.Types.ObjectId(
					lessonId,
				),
			);

			// FIXED BUG
			progress.total_points =
				(progress.total_points || 0) +
				50;

			progress.last_activity_at =
				new Date();

			await progress.save();
		}

		return {
			message:
				"Lesson completed successfully",
		};
	}
}