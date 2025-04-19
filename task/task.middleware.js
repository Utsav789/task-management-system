import Task from "./task.model.js";

export const isOwnerOfTask = async (req, res, next) => {
	// extract id from params
	const taskId = req.params.id;

	// find task through id
	const task = await Task.findOne({ _id: taskId });

	if (!task) {
		return res.status(400).send({ message: "Task does not exists" });
	}

	const isOwnerOfTask = task.createdBy.equals(req.loggedInId);

	if (!isOwnerOfTask) {
		return res.status(409).send({ message: "You are not owner of this task" });
	}
	next();
};
