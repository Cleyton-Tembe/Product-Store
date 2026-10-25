import mongoose from "mongoose";

console.log("env: ", process.env.MONGO_URL);

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(String(process.env.MONGO_URL));
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
  }
};
