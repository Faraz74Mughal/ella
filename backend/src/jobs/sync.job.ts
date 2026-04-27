import cron from "node-cron";
import syncToAtlas from "../services/sync.service";


function startSyncJob() {
  cron.schedule("*/30 * * * * *", () => {
    syncToAtlas();
  });
}

export default startSyncJob;