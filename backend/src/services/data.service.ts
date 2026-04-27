import {Data} from "../models/data";
import {getDBStatus} from "../config/db";

async function saveData(payload: any) {
  const isOnline = getDBStatus();

  const data = new Data({
    ...payload,
    synced: isOnline,
  });

  await data.save();

  console.log(isOnline ? "Saved to Atlas" : "Saved locally");
}

export { saveData };
