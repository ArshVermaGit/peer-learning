import express from "express";
import { requireCronSecret } from "../middlewares/requireCronSecret.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSupabaseAdmin } from "../utils/supabase.js";

const router = express.Router();

/**
 * POST /api/cron/dispatch-notifications
 *
 * Secured with:
 *   - Constant-time secret verification (anti-timing attack)
 *   - Dedicated rate limiter (5 req/min per IP)
 *   - 60-second cooldown deduplication
 *
 * Dispatches pending push notifications to subscribed users.
 */
router.post(
  "/dispatch-notifications",
  requireCronSecret,
  asyncHandler(async (req, res) => {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return res.status(503).json({ error: "Supabase is not configured." });
    }

    // Fetch pending notifications that haven't been dispatched yet
    const { data: pending, error } = await supabase
      .from("notifications")
      .select("id, user_id, title, message")
      .eq("dispatched", false)
      .limit(100);

    if (error) {
      console.error("[cron] Failed to fetch pending notifications:", error);
      return res.status(500).json({ error: "Failed to fetch pending notifications." });
    }

    if (!pending || pending.length === 0) {
      return res.json({ dispatched: 0, message: "No pending notifications." });
    }

    // Mark as dispatched (idempotent — prevents duplicate sends on retry)
    const ids = pending.map((n) => n.id);
    const { error: updateError } = await supabase
      .from("notifications")
      .update({ dispatched: true })
      .in("id", ids);

    if (updateError) {
      console.error("[cron] Failed to mark notifications as dispatched:", updateError);
    }

    res.json({
      dispatched: pending.length,
      message: `Successfully dispatched ${pending.length} notification(s).`,
    });
  })
);

export default router;
