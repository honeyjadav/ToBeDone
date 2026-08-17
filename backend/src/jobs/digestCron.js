import cron from "node-cron";
import Workspace from "../models/Workspace.js";
import { generateAndSaveDigest } from "../controllers/activityLogController.js";

const DEFAULT_WINDOW_HOURS = 24;

// Every hour, refresh the current bucket's digest for each workspace.
// generateAndSaveDigest is idempotent within a bucket: if there's no new
// activity since it was last generated, it does nothing (no AI call, no
// duplicate document). This just makes sure the digest doesn't go stale
// if nobody opens the app for a while.
cron.schedule("0 * * * *", async () => {
  console.log("[digestCron] Refreshing current-bucket digests...");
  const workspaces = await Workspace.find({}).select("_id").lean();

  let refreshed = 0;
  for (const ws of workspaces) {
    try {
      const saved = await generateAndSaveDigest(ws._id, DEFAULT_WINDOW_HOURS);
      if (saved) refreshed += 1;
    } catch (err) {
      console.error(`[digestCron] Failed digest for workspace ${ws._id}:`, err.message);
    }
  }
  console.log(`[digestCron] Done. ${refreshed}/${workspaces.length} workspace(s) have a digest.`);
});

console.log("[digestCron] Digest cron job registered (hourly refresh, 24h window).");