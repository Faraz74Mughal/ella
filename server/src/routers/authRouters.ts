import express from "express"
import rateLimit from "express-rate-limit"
import { AuthController } from "../controllers/auth.controller"



const router =  express.Router()

const authLimiter =  rateLimit({
    windowMs:15*60*1000,
    max:5,
    message:'Too many authentication attempts, please try again later'
})

router.post('/register',authLimiter,AuthController.register)
router.post('/login',authLimiter,AuthController.login)

export default router