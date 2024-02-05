import express from "express";
import { getCurrent, login, logout, register } from "../../controllers/auth.js";
import { authenticate } from "../../middlewares/authenticate.js";
import {validateBody }from "../../middlewares/validateBody.js";
import { schemas } from "../../schemas/usersSchemas.js";


 const authRouter = express.Router();

authRouter.post("/register", validateBody(schemas.registerSchema), register);
authRouter.post("/login", validateBody(schemas.loginSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);

export {authRouter};