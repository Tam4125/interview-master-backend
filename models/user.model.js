import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minlength: 6,
    },
    avt: {
        data: Buffer,
        contentType: String,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;