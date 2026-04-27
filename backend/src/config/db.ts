import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MONGODB connection FAILED: ", error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;

// import mongoose from "mongoose";

// const ATLAS_URI = process.env.MONGO_DB_CONNECTION_STRING!;
// const LOCAL_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ella2";

// let isOnline = false;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(ATLAS_URI, {
//       serverSelectionTimeoutMS: 3000,
//     });
//     console.log("Connected to MongoDB Atlas 🚀");
//     isOnline = true;
//   } catch (error) {
//     console.log(
//       "⚠️ Atlas failed, switching to LOCAL DB",
//       (error as Error).message,
//     );
//     try {
//       await mongoose.connect(LOCAL_URI);
//       isOnline = false;
//     } catch (err) {
//       console.log(
//         "❌ LOCAL DB connection failed as well !!!",
//         (err as Error).message,
//       );
//       process.exit(1);
//     }
//   }
// };

// function getDBStatus() {
//   return isOnline;
// }

// export default connectDB;
// export { getDBStatus };
