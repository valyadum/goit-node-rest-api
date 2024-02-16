import Joi from "joi";

const registerSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    subscription: Joi.string()
});
const emailSchema = Joi.object({
    email: Joi.string().email().required(),
})
const loginSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
});

export const schemas = {
    registerSchema,
    loginSchema, 
    emailSchema
}