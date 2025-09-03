import { NextFunction, Response, Request } from 'express';
import { sendError, sendResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { IUser } from '../interface/userInterface';
import CustomStatusCodes from '../utils/custom-status-code';
import { LessonModel } from '../models/lesson.model';
import { ILesson } from '../interface/lessonInterface';
import { PaginationRequest } from '../interface/paginationInterface';

export class LessonController {
  static async createLesson(req: Request, res: Response, next: NextFunction) {
    const {
      title,
      description,
      content,
      level,
      category,
      order,
      multimedia,
      createdBy,
      isPublished,
    } = req.body;

    try {
      const lesson = await LessonModel.create({
        title,
        description,
        content,
        level,
        category,
        order,
        multimedia,
        createdBy,
        isPublished,
      });

      if (lesson) {
        sendResponse(res, CustomStatusCodes.OK, true, 'Lesson create successfully.', lesson);
      }
    } catch (error) {
      next(error);
    }
  }

  static async fetchLessons(req: PaginationRequest, res: Response, next: NextFunction) {
   
    try {
      const { data, pagination } = await req.paginatedResults!;
      // (await LessonModel.find({}).populate('createdBy', 'firstName lastName email', 'User')) ||
      // [];
      sendResponse(res, CustomStatusCodes.OK, true, 'Lesson fetch successfully.', {
        data: data,
        pagination: pagination,
      });
    } catch (error) {
      next(error);
    }
  }
}
