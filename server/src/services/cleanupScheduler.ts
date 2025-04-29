import { CronJob } from 'cron';
import supabaseAdmin from './supabaseAdmin';

/**
 * Cleans up old selfie candidates that haven't been matched
 */
async function cleanupSelfies() {
  try {
    // Get the timestamp for 24 hours ago
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = yesterday.toISOString();

    // Delete selfie candidates older than 24 hours with 'pending' status
    // Fix type issue by explicitly typing the response or adjusting the code
    const { data, error } = await supabaseAdmin
      .from('selfie_candidates')
      .delete()
      .lt('created_at', yesterdayIso)
      .eq('status', 'pending')
      .select(); // Add .select() to get deleted rows back

    if (error) {
      console.error('Error cleaning up old selfie candidates:', error);
      return;
    }

    // Fix the type issue by safely accessing data
    const deletedCount = Array.isArray(data) ? data.length : 0;
    console.log(`Cleaned up ${deletedCount} old selfie candidates.`);
  } catch (err) {
    console.error('Error in selfie cleanup job:', err);
  }
}

/**
 * Sets up a scheduler to run cleanup tasks at regular intervals
 * @param minutes How often to run the cleanup (in minutes)
 */
export function setupCleanupScheduler(minutes = 60) {
  // Convert minutes to cron format
  const cronExpression = `*/${minutes} * * * *`; // runs every X minutes

  // Create and start the cron job
  const job = new CronJob(
    cronExpression,
    cleanupSelfies,
    null, // onComplete
    true, // start job right now
    'America/Los_Angeles' // timezone
  );

  console.log(`Selfie cleanup scheduler started, runs every ${minutes} minute(s).`);
  return job;
}