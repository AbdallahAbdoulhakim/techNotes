import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DATABASE CONNECTION SUCCEDED!");
  } catch (error) {
    console.log(`DATABASE CONNECTION FAILED WITH ERROR ${error?.message}`);
  }
};

export default dbConnect;
