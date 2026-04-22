import dotenv from "dotenv";
import connectDB from "../config/db";
import { User } from "../models/user.model";
import usersSeed from "./data/user.seed";
// const connectDB = require("../config/db.ts");
// const {User} = require("../models/user.model");
// const usersSeed = require("./data/user.seed");

dotenv.config({ path: "./.env" });

const importData = async () => {
  try {
    await connectDB();

    // Optional: clear existing users
    // await User.deleteMany();

    await User.insertMany(usersSeed);

    console.log("🌱 Data Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

importData();