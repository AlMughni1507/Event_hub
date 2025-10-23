const cron = require('node-cron');
const { archiveEndedEvents } = require('./eventCleanup');

/**
 * Initialize all cron jobs
 */
const initCronJobs = () => {
  console.log('⏰ Initializing cron jobs...');

  // Run every day at 2 AM to archive ended events
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Running daily event archival job...');
    try {
      const result = await archiveEndedEvents();
      console.log(`✅ Daily archival complete: ${result.archived} events archived`);
    } catch (error) {
      console.error('❌ Daily archival job failed:', error);
    }
  });

  // Also run every 6 hours for more frequent checks
  cron.schedule('0 */6 * * *', async () => {
    console.log('⏰ Running 6-hour event archival check...');
    try {
      const result = await archiveEndedEvents();
      if (result.archived > 0) {
        console.log(`✅ Archived ${result.archived} events`);
      }
    } catch (error) {
      console.error('❌ 6-hour archival check failed:', error);
    }
  });

  console.log('✅ Cron jobs initialized:');
  console.log('   - Daily archival at 2:00 AM');
  console.log('   - 6-hour archival checks');
};

module.exports = { initCronJobs };
