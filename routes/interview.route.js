import {Router} from "express";
import {authorize} from "../middlewares/auth.middleware.js";
import {getInterview, getInterviewByUserId, updateInterview} from "../controllers/interview.controller.js";

const interviewRouter = Router();

interviewRouter.get('/me',authorize, getInterviewByUserId)
interviewRouter.get('/:id', authorize, getInterview)
interviewRouter.put('/:id', authorize, updateInterview)

export default interviewRouter;