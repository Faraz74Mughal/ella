import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalErrorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';
import teacherRoutes from './routes/teacher.routes';
import lessonRoutes from './routes/lesson.routes';
import exerciseRoutes from './routes/exercise.routes';

const app: Application = express();

// --- Global Middlewares ---
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "16kb" })); // Security: Limit body size
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // For static assets
app.use(cookieParser()); // To read/write HTTP-only cookies

// --- Route Mounting ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/lessons", lessonRoutes);
app.use("/api/v1/exercises", exerciseRoutes);

// --- Global Error Handler (Must be last) ---
app.use(globalErrorHandler);

export { app };