import mongoose from "mongoose";

// luintelutsav5
// 4ojqitlNaiI1Izol

const connectDb = async () => {
	try {
		const mongo_URi = process.env.MONGO_URI;
		await mongoose.connect(mongo_URi);
		console.log("Connected to Database.");
	} catch (error) {
		console.log("Connection Failed !!!!");
		console.log(error.message);
		process.exit(1);
	}
};
export default connectDb;
