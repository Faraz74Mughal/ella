import express from "express"
import { authenticate, authorize } from "../middleware/auth"
import { UserController } from "../controllers/user.controller"
import { UserRole } from "../types"

const router =  express.Router()


router.get('/profile',authenticate,UserController.fetchProfile)
router.get('/admin',authenticate,authorize(UserRole.ADMIN),UserController.fetchAdmin)
router.post('/sign-out',authenticate,authorize(UserRole.TEACHER),UserController.signOut)

export default router