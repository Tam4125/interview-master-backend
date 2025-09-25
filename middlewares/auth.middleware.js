import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";

export const authorize = async (req, res, next) => {
    try {
        // let token;
        // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //     token = req.headers.authorization.split(' ')[1];
        // }
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({error: 'Unauthorized, No token provided.'});
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({error: 'Unauthorized, password not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized: " + error.message});
    }
}
