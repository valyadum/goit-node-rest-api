import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import path from "path";
import gravatar from "gravatar";
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/users.js";
import fs from "fs/promises";
import Jimp from "jimp";


const avatarsDir = path.resolve("public", "avatars");

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }
        const avatarURL = gravatar.url(email);
    
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...req.body,avatarURL, password: hashPassword});
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
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
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