import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import { nanoid } from "nanoid";
import path from "path";
import gravatar from "gravatar";
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/users.js";
import fs from "fs/promises";
import Jimp from "jimp";
import { sendEmail } from "../helpers/sendEmail.js";


const avatarsDir = path.resolve("public", "avatars");

const { SECRET_KEY, BASE_URL } = process.env;

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }

        const avatarURL = gravatar.url(email);
        const verificationToken = nanoid();
        
        const verifyEmail = {
            to: email, subject: "Verify email",
            html:`<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
        }
        
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword, verificationToken });
        await sendEmail(verifyEmail);

        res.status(201).json(
            {
                "users": {
                    email: newUser.email,
                    subscription: newUser.subscription,
                    avatarURL:newUser.avatarURL
                }
            })
    }
    catch (error) {
        next(error)
    }
};
export const verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if (!user) {
            throw HttpError(404, "User not found");
        }
        const verifyEmail = {
            to: email, subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
        }
        await sendEmail(verifyEmail);
        res.status(200).json({
            message: "Verification email sent"
        });
    } catch (error) {
        next(error)
    }
};
export const resendVerifyEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(400, "Missing required field email");
        }
        if (user.verify) {
            throw HttpError(400, "Verification has already been passed")
        }
        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
        res.status(200).json({
            message: "Verification successful"
        });
    } catch (error) {
        next(error)
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }
        if (!user.verify) {
            throw HttpError(409, "Email not verified");
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        }
        const payload = {
            id: user._id
        }
        console.log(SECRET_KEY);
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
        await User.findOneAndUpdate(user._id, { token });

        res.json({
            token,
            "users": {
                email: user.email,
                subscription: user.subscription,
            }
        })
    } catch (error) {
        next(error)
    }
}
export const getCurrent = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;
        res.json({
            email,
            subscription,
        })
    } catch (error) {
        next(error)
    }
}
export const logout = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findOneAndUpdate(_id, { token: '' });
        throw HttpError(204);


    } catch (error) {
        next(error)
    }
}
export const updateAvatar = async (req, res, next) => {
    try {
        const { _id } = req.user;
        if (!req.file) {
            throw HttpError(400, "Please add your file");
        }
        const { path: tempUpload, originalname } = req.file;
        const filename = `${_id}_${originalname}`;

        const resultUpload = path.join(avatarsDir, filename);

        const img = await Jimp.read(tempUpload);
        await img.resize(250, 250).quality(60).write(tempUpload);


        await fs.rename(tempUpload, resultUpload);
        const avatarURL = path.join("avatars", filename);
        await User.findByIdAndUpdate(_id, { avatarURL });
        res.json({
             avatarURL
         })
    } catch (error) {
        next(error)
    }
}