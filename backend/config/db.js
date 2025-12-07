import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI env var is not set");
    }

    const conn = await mongoose.connect(uri);
    console.log(`Mongo db works: ${conn.connection.host}`);
  } catch (error) {
    console.error(`error:${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
