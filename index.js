import express from "express";
import connectDb from "./db.connection.js";
import { userController } from "./user/user.controller.js";
import { taskController } from "./task/task.controller.js";
import dotenv from "dotenv";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;
dotenv.config();

connectDb();

app.use(userController);
app.use(taskController);

app.listen(PORT, () => {
	console.log(`App is listening on PORT:${PORT}`);
});
