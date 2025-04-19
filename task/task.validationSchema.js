import Joi from "joi";

export const taskValidationSchema = Joi.object({
	title: Joi.string().trim().max(100).required().messages({
		"string.empty": "Title is required.",
		"string.max": "Title must be at most 100 characters.",
	}),

	description: Joi.string().trim().max(1000).required().messages({
		"string.empty": "Description is required.",
		"string.max": "Description must be at most 1000 characters.",
	}),

	status: Joi.string()
		.valid("pending", "in-progress", "completed")
		.optional()
		.messages({
			"any.only":
				'Status must be one of: "pending", "in-progress", "completed".',
		}),

	priority: Joi.string().valid("low", "medium", "high").optional().messages({
		"any.only": 'Priority must be one of: "low", "medium", "high".',
	}),

	dueDate: Joi.date().greater("now").optional().messages({
		"date.greater": "Due date must be in the future.",
	}),

	createdBy: Joi.string().messages({
		"string.empty": "User reference (createdBy) is required.",
	}),
});

export const paginationSchema = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	limit: Joi.number().integer().min(1).default(10),
	sort: Joi.number().valid(1, -1).default(-1),
});

export const statusValidationSchema = Joi.object({
	status: Joi.string()
		.valid("pending", "in-progress", "completed")
		.optional()
		.messages({
			"any.only":
				'Status must be one of: "pending", "in-progress", "completed".',
		}),
});
