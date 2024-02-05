import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/users.js";

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ ...req.body, password: hashPassword });
        res.status(201).json(
            {
                "users": {
                    email: newUser.email,
                    subscription: newUser.subscription,
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