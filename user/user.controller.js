import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import UserTable from "./user.model.js";
import {
	loginCredentialSchema,
	registerUserSchema,
} from "./user.validation.js";
import { validateReqBody } from "../middleware/validate.schema.js";

const router = express.Router();

router.post(
	"/user/register",
	validateReqBody(registerUserSchema),
	async (req, res) => {
		const newUser = req.body;

		//find if the user already exists
		const user = await UserTable.findOne({ email: newUser.email });

		if (user) {
			return res.status(409).send({ message: "User already exists." });
		}

		//hash password
		const plainPassword = newUser.password;
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

		newUser.password = hashedPassword; //12345678
		//create user
		await UserTable.create(newUser);

		return res.status(201).send({ message: "User registered Successfully." });
	}
);

router.post(
	"/user/login",
	validateReqBody(loginCredentialSchema),
	async (req, res) => {
		// extracting loginCredentials from req.body
		const loginCredentials = req.body;

		// finding user with provided email
		const user = await UserTable.findOne({ email: loginCredentials.email });

		// if no user,throw error
		if (!user) {
			return res.status(404).send({ message: "Invalid credentials." });
		}

		// check for password match

		const plainPassword = loginCredentials.password;
		const hashedPassword = user.password;
		const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);

		if (!isPasswordMatch) {
			return res.status(404).send({ message: "Invalid credentials." });
		}

		// generate token

		const payload = { email: user.email };
		const secretKey = process.env.JWT_SECRET_KEY;

		const token = jwt.sign(payload, secretKey, {
			expiresIn: "7d",
		});

		// remove password before sending to user
		user.password = undefined;

		return res
			.status(200)
			.send({ message: "success", accessToken: token, userDetails: user });
	}
);

export { router as userController };
