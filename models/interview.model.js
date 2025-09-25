import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
    type: {
        type: String,
        enum:['Technical', 'Non-Technical', 'Mixed'],
        required: true,
        trim: true,
    },
    role: {
        type: String,
        trim: true,
        required: true,
    },
    level: {
        type: String,
        enum: ['Intern', 'Fresher', 'Middle', 'Senior'],
        required: true,
        trim: true,
    },
    techstack: {
        type: [String],
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    questions: {
        type: [String],
        required: true,
    },
    finished: {
        type: Boolean,
        default: false,
    },
    cv : {
        data: Buffer,   // Binary Data
        contentType: String,
    },
    cvText : {
        type: String,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
}, {timestamps: true});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;