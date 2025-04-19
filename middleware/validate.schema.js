export const validateReqBody = (validationSchema) => {
	return async (req, res, next) => {
		try {
			const validateData = await validationSchema.validate(req.body);

			req.body = validateData.value;

			next();
		} catch (error) {
			return res.status(400).send({ message: error.message });
		}
	};
};
