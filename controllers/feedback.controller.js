import Feedback from "../models/feedback.model.js";
import mongoose from "mongoose";
import {GoogleGenAI} from "@google/genai";
import {GOOGLE_GEMINI_API_KEY} from "../config/env.js";
import Interview from "../models/interview.model.js";

export const getFeedback = async (req, res, next) => {
    try {
        const {interviewId} = req.body;
        const feedback = await Feedback.findOne({interviewId: interviewId});

        if (!feedback) {
            return res.status(404).json({success:false, error: "Feedback not found"});
        }

        return res.status(200).json({success: true, feedback: feedback});

    } catch (error) {
        next(error);
    }
}

export const createFeedback = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {formattedTranscript, userId, interviewId} = req.body;
        if (!formattedTranscript) {
            return res.status(400).json({success:false, error: "Formatted Transcript not found"});
        }

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(400).json({success:false, error: "Interview not found"});
        }

        const ai = new GoogleGenAI({apiKey: GOOGLE_GEMINI_API_KEY});
        const {text: feedbackText} = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `
            You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
            The interview Topic are:
            The job role is ${interview.role}.
            - The job experience level is ${interview.level}.
            - The tech stack used in the job is: ${interview.techstack}.
            - The focus between behavioural and technical questions should lean towards: ${interview.type}.
            - The list of question: ${interview.questions}
            The interview's transcript:
            ${formattedTranscript}
    
            Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
            - **Communication Skills**: Clarity, articulation, structured responses.
            - **Technical Knowledge**: Understanding of key concepts for the role.
            - **Problem-Solving**: Ability to analyze problems and propose solutions.
            - **Cultural & Role Fit**: Alignment with company values and job role.
            - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
            
            Then give final feedback in these aspect:
            - total score from 0 to 100
            - strengths of candidate as a list of string
            - constraints of candidate as a list of string
            - areas for improvement as a list of string
            - final assessment paragraph
           
            Return the feedback strictly as **valid JSON** only. 
            Do not include backticks or markdown formatting. 
            The response must be a single JSON object:
            {score: total score, strengths: strengths, constraints: constraints, improvement: areas for improvement, finalAssessment: final assessment paragraph},
            `,
        })
        let cleanText = feedbackText.trim();
        if (cleanText.startsWith("```")) {
            cleanText = cleanText.replace(/```json|```/g, "").trim();
        }

        const feedbackObject = JSON.parse(cleanText);

        const feedback = {
            score: feedbackObject.score,
            strengths: feedbackObject.strengths,
            constraints: feedbackObject.constraints,
            improvement: feedbackObject.improvement,
            finalAssessment: feedbackObject.finalAssessment,
            userId: userId,
            interviewId: interviewId,
        };

        const newFeedback = await Feedback.create([feedback], {session});
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({success: true, message: "New feedback is created successfully", data: newFeedback[0]});

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}