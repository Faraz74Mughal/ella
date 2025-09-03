import express from "express"
import {  authenticate, authorize } from "../middleware/auth"
import { UserController } from "../controllers/user.controller"
import { UserRole } from "../interface/userInterface"

const router =  express.Router()


router.get('/current-user',authenticate,UserController.fetchCurrentUser)
router.get('/admin',authenticate,authorize(UserRole.ADMIN),UserController.fetchAdmin)
router.post('/sign-out',authenticate,UserController.signOut)

export default router