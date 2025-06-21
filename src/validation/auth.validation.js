import Joi from 'joi';

export const registerSchema = Joi.object({

    username: Joi.string().trim().min(3).max(30).lowercase().required(),
    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
}),
    role: Joi.string().trim().lowercase().required(),
})

export const loginSchema = Joi.object({

    email: Joi.string().trim().email().lowercase().required(),
    password: Joi.string().trim().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
})
})