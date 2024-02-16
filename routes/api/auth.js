import express from "express";
import { getCurrent, login, logout, register, resendVerifyEmail, updateAvatar, verifyEmail } from "../../controllers/auth.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { upload } from "../../middlewares/upload.js";
import {validateBody }from "../../middlewares/validateBody.js";
import { schemas } from "../../schemas/usersSchemas.js";


 const authRouter = express.Router();

authRouter.post("/register", validateBody(schemas.registerSchema), register);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/verify", validateBody(schemas.emailSchema), resendVerifyEmail)
authRouter.post("/login", validateBody(schemas.loginSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch("/avatars",authenticate,upload.single("avatar"), updateAvatar)

export {authRouter};