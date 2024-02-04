import { Schema, model } from "mongoose";
import { HandleMongooseError } from "../helpers/HandleMongooseError.js";
import Joi from "joi";

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
    }

}, { versionKey: false, timestamps: true })



const registerSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email(),
    subscription: Joi.string()
});
const loginSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email(),
});

 export const schemas = {
    registerSchema,
    loginSchema
 }
userSchema.post("save", HandleMongooseError);
export const User = model("user", userSchema);

