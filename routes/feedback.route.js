import {Router} from "express";
import {getFeedback, createFeedback} from "../controllers/feedback.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";

const feedbackRouter = Router();

feedbackRouter.post('/me', authorize, getFeedback);
feedbackRouter.post('/', authorize, createFeedback);

export default feedbackRouter;