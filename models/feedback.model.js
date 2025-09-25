import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    score : {
        type: Number,
        required: true,
    },
    strengths: {
        type: [String],
        default: [""],
    },
    constraints: {
        type: [String],
        default: [""],
    },
    improvement: {
        type: [String],
        default: [""],
    },
    interviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true,
        index: true,
    },
    finalAssessment: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, {timestamps: true});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;