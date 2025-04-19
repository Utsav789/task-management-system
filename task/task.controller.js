import express from "express";
import {
	paginationSchema,
	statusValidationSchema,
	taskValidationSchema,
} from "./task.validationSchema.js";
import Task from "./task.model.js";
import { isUser } from "../middleware/authentication.middleware.js";
import { validateMongoIdFromReqParams } from "../middleware/validate.mongo.id.js";
import { isOwnerOfTask } from "./task.middleware.js";
import { validateReqBody } from "../middleware/validate.schema.js";
const router = express.Router();

//create task
router.post(
	"/api/create/task",
	isUser,
	async (req, res, next) => {
		//here we validate task data
		try {
			console.log("first");
			const validateData = await taskValidationSchema.validate(req.body);
			console.log("second");
			req.body = validateData.value;
			next();
		} catch (error) {
			console.log("Error in create task middleware");
			return res.status(400).send({ message: error.message });
		}
	},
	async (req, res) => {
		const newTask = req.body;
		newTask.createdBy = req.loggedInId;
		console.log(newTask);
		//find if the task already exists
		const task = await Task.findOne({
			title: newTask.title,
			createdBy: newTask.createdBy,
		});

		if (task) {
			return res
				.status(409)
				.send({ message: "Task already created by current user." });
		}
		await Task.create(newTask);
		return res
			.status(201)
			.send({ message: "Task created successfully", task: newTask });
	}
);

// retrieve a particular task using task id from params
router.get(
	"/api/tasks/:id",
	isUser,
	validateMongoIdFromReqParams,
	async (req, res) => {
		const taskID = req.params.id;
		const userID = req.loggedInId;

		const task = await Task.findOne({ _id: taskID, createdBy: userID });

		if (!task) {
			return res.status(404).send({ message: "Task not found" });
		}
		return res.status(200).send({ message: "success", taskDetail: task });
	}
);

// update/edit task
router.put(
	"/api/tasks/:id",
	isUser,
	validateMongoIdFromReqParams,
	isOwnerOfTask,
	validateReqBody(taskValidationSchema),
	async (req, res) => {
		//extract task id from req.params
		const taskId = req.params.id;
		const task = await Task.findOne({ _id: taskId });
		// extract new values from req body

		const newValues = req.body;

		await Task.updateOne(
			{ _id: taskId },
			{
				$set: {
					...newValues,
				},
			}
		);
		return res.status(200).send({ message: "Task is updated Successfully" });
	}
);

//delete task by id
router.delete(
	"/api/tasks/:id",
	isUser,
	validateMongoIdFromReqParams,
	isOwnerOfTask,
	async (req, res) => {
		const taskId = req.params.id;

		//? deleting product
		await Task.deleteOne({ _id: taskId });

		return res.status(200).send({ message: "Task is deleted Successfully" });
	}
);

//retrieve all task with pagination,filtering and sorting
router.post(
	"/api/tasks",
	isUser,
	validateReqBody(paginationSchema),
	async (req, res) => {
		const userId = req.loggedInId;
		const paginationData = req.body;

		const limit = paginationData.limit;
		const page = paginationData.page;
		const sort = paginationData.sort;

		const skip = (page - 1) * limit;

		const tasks = await Task.aggregate([
			{
				$match: { createdBy: userId },
			},
			{
				$sort: { createdAt: sort }, //for descending -1 and ascending 1
			},
			{
				$skip: skip,
			},
			{
				$limit: limit,
			},
		]);

		//? calculate page Number required
		const totalItems = await Task.find({ createdBy: userId }).countDocuments();

		const totalPage = Math.ceil(totalItems / limit);

		return res.status(200).send({
			message: "Success",
			taskList: tasks,
			totalPage,
		});
	}
);

//patch i.e update status only
router.patch(
	"/api/tasks/:id/status",
	isUser,
	validateMongoIdFromReqParams,
	validateReqBody(statusValidationSchema),async(req,res)=>{
		const taskId = req.params.id;
		const task = await Task.findOne({ _id: taskId });
		const newValues = req.body;

		await Task.updateOne(
			{ _id: taskId },
			{
				$set: {
					...newValues,
				},
			}
		);
		return res.status(200).send({ message: "Status is updated Successfully" });
	}
	
);

export { router as taskController };
