import { db, activityLogTable } from "@workspace/db";

export async function logActivity(type: string, message: string): Promise<void> {
  try {
    await db.insert(activityLogTable).values({ type, message });
  } catch {
    // Non-critical — don't throw
  }
}
