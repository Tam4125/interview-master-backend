import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {JWT_SECRET, JWT_EXPIRES_IN, SESSION_DURATION} from "../config/env.js";


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                error: "All fields (username, email, password) are required",
            });
        }

        // Check if user already existed
        const existingUser = await User.findOne({email:email});

        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({success:false, error: "User already exists"});
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);  // Generate a random salt with 10 rounds (cost factor)
        const hash = await bcrypt.hash(password, salt);
        const newUser = await User.create([{username, email, password:hash}], {session});
        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                token,
                user: newUser[0],
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("SignUp Error:", error);
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required",
            });
        }


        // Check user existed ?
        const user = await User.findOne({email:email});

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found. Please sign up first.",
            });

        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid email or password",
            });

        }

        // create JWT
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        // set cookie
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            maxAge: SESSION_DURATION * 1000,
            sameSite: "none",
            path: "/"   //makes the cookie available to all routes in your domain
        });


        return res.status(200).json({
            success: true,
            message: 'Signed in successfully',
            data: {
                token,
                user
            }
        });
    } catch (error) {
        next(error);
    }
}
