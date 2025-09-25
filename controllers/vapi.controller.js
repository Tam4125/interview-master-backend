import mongoose from "mongoose";
import Interview from "../models/interview.model.js";
import {createPartFromUri, createUserContent, GoogleGenAI} from "@google/genai";
import {GOOGLE_GEMINI_API_KEY} from "../config/env.js";
import {GoogleAIFileManager} from '@google/generative-ai/server'


export const createInterview = async (req, res, next) => {
    const {type, role, level, techstack, amount} = req.body;
    const user = req.user;
    const cv = req.file;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const fileManager = new GoogleAIFileManager(GOOGLE_GEMINI_API_KEY)
        const ai = new GoogleGenAI({apiKey: GOOGLE_GEMINI_API_KEY});

        let cvText = ""

        if (cv) {
            // Upload the CV to the Gemini Files API.
            const uploadResult = await fileManager.uploadFile(cv.buffer, {
                mimeType: cv.mimetype,
                displayName: `${user._id}-${Date.now()}-${cv.originalname}`,
            });
            const fileUri = uploadResult.file.uri;

            // Use the Gemini model to extract text from the uploaded file's URI.
            const {text:cvExtracted} = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: createUserContent([
                    createPartFromUri(fileUri, cv.mimetype),
                    "Extract all text from this CV, and return only plain text"
                ]),
            })
            cvText=cvExtracted;
        }


        const {text:questions} = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Prepare questions for a job interview.
                    The job role is ${role}.
                    The job experience level is ${level}.
                    The tech stack used in the job is: ${techstack}.
                    The focus between behavioural and technical questions should lean towards: ${type}.
                    The expected number of questions required is: ${amount}.
                    The candidate cv after change to Text is: ${cvText}.
                    Please return only the questions, not too long questions, without any additional text.
                    The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                    Return the questions formatted like this:
                    ["Question 1", "Question 2", "Question 3"]`
        });

        const interview = {
            type: type,
            role: role,
            level: level,
            techstack: techstack.split(","),
            amount: Number(amount),
            questions: JSON.parse(questions),
            userId: user._id,
            finished: false,
        };
        if (cv) {
            interview.cv = {data: cv.buffer, contentType: cv.mimetype};
            interview.cvText = cvText;
        }

        const newInterview = await Interview.create([interview], {session});
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({success: true, message: 'Interview successfully recorded', data: {interview:newInterview[0]}});

    } catch (error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

