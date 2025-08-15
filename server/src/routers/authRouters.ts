import express from "express"
import rateLimit from "express-rate-limit"
import { AuthController } from "../controllers/auth.controller"



const router =  express.Router()

const authLimiter =  rateLimit({
    windowMs:5*60*1000,
    max:10,
    message:'Too many authentication attempts, please try again later'
})

router.post('/register',authLimiter,AuthController.register)
router.post('/login',authLimiter,AuthController.login)
router.post('/resend-verify-email',authLimiter,AuthController.resendVerifyEmail)
router.post('/verify-email',AuthController.verifyEmail)

export default router