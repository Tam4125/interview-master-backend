import Interview from "../models/interview.model.js";

export const getInterviewByUserId = async (req, res, next) => {
    try {
        const user = req.user;
        const interviewsByUserId = await Interview.find({userId: user._id});
        if (!interviewsByUserId) {
            return res.status(404).json({success:false, error: "Interviews not found"});
        }

        return res.status(200).json({success: true, interviews: interviewsByUserId});
    } catch (error) {
        next(error);
    }
}

export const getInterview = async (req, res, next) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({success:false, error: "Interview not found"});
        }
        return res.status(200).json({success: true, interview: interview});
    } catch (error) {
        next(error);
    }
}

export const updateInterview = async (req, res, next) => {
    try {
        const updateData = req.body;
        const updatedInterview = await Interview.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            {new:true, runValidators:true}
        )
        if (!updatedInterview) {
            return res.status(404).json({success:false, error: "Interview not found"});
        }
        return res.status(200).json({success: true, message: "Update By id successfully", interview: updatedInterview});
    } catch (error) {
        next(error);
    }
}
