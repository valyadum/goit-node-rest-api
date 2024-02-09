import { Schema, model } from "mongoose";
import { HandleMongooseError } from "../helpers/HandleMongooseError.js";


const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: ""
    },
    avatarURL: {
        type: String,
        required: true
    }

}, { versionKey: false, timestamps: true })

userSchema.post("save", HandleMongooseError);
const User = model("user", userSchema);
export { User };
