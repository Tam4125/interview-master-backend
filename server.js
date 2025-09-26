import express from 'express';
import {FRONT_END_SERVER, PORT} from "./config/env.js";
import {connectToDatabase} from "./database/mongodb.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";
import interviewRouter from "./routes/interview.route.js";
import feedbackRouter from "./routes/feedback.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import vapiRouter from "./routes/vapi.route.js";


const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

// allow frontend to send credentials (cookies)
server.use(cors({
    origin: FRONT_END_SERVER,
    credentials: true,  // if you use cookies/auth
}));

server.use('/users', userRouter);
server.use('/auth', authRouter);
server.use('/vapi', vapiRouter);
server.use('/interviews', interviewRouter);
server.use('/feedbacks', feedbackRouter);

server.use(errorMiddleware);

server.get('/', (req, res) => {
    res.send("Welcome to the InterviewMaster API!");
});


server.listen(PORT, async () => {
    console.log(`Backend is running`);
    await connectToDatabase();
});

export default server;