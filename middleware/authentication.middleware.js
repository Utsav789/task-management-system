import UserTable from "../user/user.model.js";
import jwt from "jsonwebtoken";

export const isUser = async (req, res, next) => {
	// extract token from req.headers
	
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).send({ message: "Unauthorized." });
	}

	// extract payload from token by decryption

	let payload = null;

	try {
		const secretKey = process.env.JWT_SECRET_KEY;

		payload = jwt.verify(token, secretKey);
	} catch (error) {
		return res.status(401).send({ message: "Unauthorized." });
	}

	// find user using email from payload
	const user = await UserTable.findOne({ email: payload.email });

	if (!user) {
		return res.status(401).send({ message: "Unauthorized." });
	}
	req.loggedInId = user._id;

	next();
};
