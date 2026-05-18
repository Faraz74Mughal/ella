// services/studentProgress.service.ts

import mongoose from "mongoose";
import { Lesson } from "../models/lesson.model";
import { StudentProgress } from "../models/studentProgress.model";

export class StudentProgressService {
	private static getStartOfDay(date: Date) {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d;
	}

	private static getDayDiff(fromDate: Date, toDate: Date) {
		const from = this.getStartOfDay(fromDate).getTime();
		const to = this.getStartOfDay(toDate).getTime();
		const oneDayMs = 24 * 60 * 60 * 1000;
		return Math.floor((to - from) / oneDayMs);
	}

	static async normalizeStreakIfMissed(progress: any) {
		if (!progress?.last_activity_at) {
			return;
		}

		const dayDiff = this.getDayDiff(
			new Date(progress.last_activity_at),
			new Date(),
		);

		if (dayDiff > 1 && (progress.current_streak || 0) !== 0) {
			progress.current_streak = 0;
			await progress.save();
		}
	}

	static applyLessonCompletionStreak(progress: any) {
		const now = new Date();
		const currentStreak = progress.current_streak || 0;

		if (!progress.last_activity_at) {
			progress.current_streak = 1;
		} else {
			const dayDiff = this.getDayDiff(
				new Date(progress.last_activity_at),
				now,
			);

			if (dayDiff === 0) {
				// Already counted today; keep streak unchanged.
				progress.current_streak = currentStreak;
			} else if (dayDiff === 1) {
				progress.current_streak = currentStreak + 1;
			} else {
				progress.current_streak = 1;
			}
		}

		progress.highest_streak = Math.max(
			progress.highest_streak || 0,
			progress.current_streak || 0,
		);
		progress.last_activity_at = now;
	}

	static async getStudentProgress(studentId: string) {
		let progress = await StudentProgress.findOne({
			student: studentId,
		});

		if (!progress) {
			progress = await StudentProgress.create({
				student: studentId,
				completed_lessons: [],
				completed_exercises: [],
				passed_lessons: [],
				unlocked_lessons: [],
				assignment_best_scores: [],
				assignment_performance: {
					average_percentage: 0,
					completed_count: 0,
				},
				lesson_best_percentages: [],
				category_performance: {
					grammar: 0,
					vocabulary: 0,
					listening: 0,
					speaking: 0,
					writing: 0,
				},
				current_streak: 0,
				highest_streak: 0,
				total_points: 0,
				total_xp: 0,
			});
		} else {
			await this.normalizeStreakIfMissed(progress);
		}

		return progress;
	}

	static async getCurrentOpenSequence(studentId: string) {
		const progress =
			await this.getStudentProgress(studentId);

		if (
			(progress.passed_lessons || []).length === 0
		) {
			return 1;
		}

		const highestCompleted =
			await Lesson.find({
				_id: {
					$in: progress.passed_lessons,
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

		// previous, current, and next 2 lessons
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

			const isPassed = (progress.passed_lessons || []).some(
				(passedId) => passedId.toString() === lesson._id.toString(),
			);

			const isUnlocked = (progress.unlocked_lessons || []).some(
				(unlockedId) => unlockedId.toString() === lesson._id.toString(),
			) || lesson.sequence_order < currentSequence;

			const lessonBestPercentage = Math.max(
				0,
				...(progress.lesson_best_percentages || [])
					.filter(
						(entry) => entry.lesson_id?.toString() === lesson._id.toString(),
					)
					.map((entry) => Number(entry.best_percentage) || 0),
			);

			return {
				...lesson.toObject(),
				status,
				is_passed: isPassed,
				is_unlocked: isUnlocked,
				best_percentage: lessonBestPercentage,
				score: lessonBestPercentage,
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

			const alreadyPassed = (progress.passed_lessons || []).some(
				(id) => id.toString() === lessonId,
			);

			if (!alreadyPassed) {
				progress.passed_lessons = [
					...(progress.passed_lessons || []),
					new mongoose.Types.ObjectId(lessonId),
				];
			}

			// FIXED BUG
			progress.total_points =
				(progress.total_points || 0) +
				50;

			this.applyLessonCompletionStreak(progress);

			const currentLesson = await Lesson.findById(lessonId).select("sequence_order");
			if (currentLesson) {
				const nextLesson = await Lesson.findOne({
					sequence_order: currentLesson.sequence_order + 1,
					is_published: true,
				});

				if (nextLesson) {
					const nextLessonAlreadyUnlocked = (progress.unlocked_lessons || []).some(
						(unlockedId) => unlockedId.toString() === nextLesson._id.toString(),
					);

					if (!nextLessonAlreadyUnlocked) {
						progress.unlocked_lessons = [
							...(progress.unlocked_lessons || []),
							nextLesson._id,
						];
					}
				}
			}

			await progress.save();
		}

		return {
			message:
				"Lesson completed successfully",
		};
	}
}