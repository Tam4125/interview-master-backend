import User from '../models/user.model.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({success: true, users: users});
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({success:false, error: "User not found"});
        }
        return res.status(200).json({success: true, user: user});
    } catch (error) {
        next(error);
    }
}
