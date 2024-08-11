import mongoose from "mongoose";

module.exports.dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log("Database connected... ");
  } catch (err) {
    console.error(err);
  }
};
