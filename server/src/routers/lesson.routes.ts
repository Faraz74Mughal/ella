import express from "express"
import {  authenticate, authorize } from "../middleware/auth"
import { LessonController } from "../controllers/lesson.controller"
import { paginate } from "../middleware/paginationMiddleware"
import { LessonModel } from "../models/lesson.model"

const router =  express.Router()


router.get('/',paginate(LessonModel,"title",[{path:"createdBy",select:"firstName lastName email",model:"User" }]),LessonController.fetchLessons)
router.post('/',LessonController.createLesson)

export default router