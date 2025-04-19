import mongoose from "mongoose";

export const validateMongoIdFromReqParams = (req, res, next) => {
	try {
		// extract id from req.params
		const id = req.params.id;

		// check for mongo id validity
		const isValidId = mongoose.isValidObjectId(id);

		// if not valid id, throw error
		if (!isValidId) {
			return res.status(400).send({ message: "Invalid id." });
		}

		next();
	} catch (error) {
		console.log("Error in validateMongoIdFromReqParams");
		console.log(error.message);
	}
};
