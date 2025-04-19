import dayjs from "dayjs";
import Joi from "joi";

export const registerUserSchema = Joi.object({
	email: Joi.string()
	  .email({ tlds: { allow: false } }) // disables checking for top-level domains like .com
	  .required()
	  .trim()
	  .lowercase()
	  .max(100)
	  .messages({
		"string.email": "Must be a valid email.",
		"any.required": "Email is required.",
	  }),
  
	password: Joi.string()
	  .required()
	  .trim()
	  .min(8)
	  .max(30)
	  .messages({
		"string.min": "Password must be at least 8 characters.",
		"string.max": "Password must be at most 30 characters.",
		"any.required": "Password is required.",
	  }),
  
	firstName: Joi.string().required().trim().max(100),
	lastName: Joi.string().required().trim().max(100),
  
	dob: Joi.date()
	  .less(dayjs().toDate())
	  .messages({
		"date.less": "DOB must be in the past.",
	  }),
  
	gender: Joi.string()
	  .valid("male", "female", "other")
	  .required()
	  .trim()
	  .messages({
		"any.only": "Gender must be male, female, or other.",
	  }),
  
	address: Joi.string().required().trim().max(255),
  });

export const loginCredentialSchema = Joi.object({
	email: Joi.string()
	  .email({ tlds: { allow: false } })
	  .required()
	  .trim()
	  .lowercase()
	  .messages({
		"string.email": "Enter a valid email.",
		"any.required": "Email is required.",
	  }),
  
	password: Joi.string().required().trim().messages({
	  "any.required": "Password is required.",
	}),
  });
