import mongoose from "mongoose";
import {Data} from "../models/data";
import { getDBStatus } from "../config/db";

const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING!;

async function syncToAtlas() {
  if (!getDBStatus()) return;

  console.log("🔄 Syncing...");

  const atlasConn = await mongoose.createConnection(MONGO_DB_CONNECTION_STRING).asPromise();
  const AtlasData = atlasConn.model("Data", Data.schema);

  const unsynced = await Data.find({ synced: false });

  for (let doc of unsynced) {
    try {
      await AtlasData.create({
        name: doc.name,
        value: doc.value,
        createdAt: doc.createdAt
      });

      doc.synced = true;
      await doc.save();

      console.log("✅ Synced:", doc._id);
    } catch (err) {
      console.log("❌ Error:", (err as Error).message);
    }
  }

  await atlasConn.close();
}

export default syncToAtlas;