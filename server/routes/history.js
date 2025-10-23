const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { 
  getUserEventHistory, 
  getArchivedEvents, 
  restoreArchivedEvent,
  archiveEndedEvents 
} = require('../utils/eventCleanup');

// GET /api/history/my-events - Get user's event history
router.get('/my-events', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await getUserEventHistory(userId);

    res.json({
      success: true,
      data: {
        total: history.length,
        events: history
      }
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event history'
    });
  }
});

// GET /api/history/archived - Get all archived events (Admin only)
router.get('/archived', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const archived = await getArchivedEvents();

    res.json({
      success: true,
      data: {
        total: archived.length,
        events: archived
      }
    });
  } catch (error) {
    console.error('Error fetching archived events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch archived events'
    });
  }
});

// POST /api/history/restore/:eventId - Restore archived event (Admin only)
router.post('/restore/:eventId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    await restoreArchivedEvent(eventId);

    res.json({
      success: true,
      message: 'Event restored successfully'
    });
  } catch (error) {
    console.error('Error restoring event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore event'
    });
  }
});

// POST /api/history/archive-now - Manually trigger archival (Admin only)
router.post('/archive-now', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await archiveEndedEvents();

    res.json({
      success: true,
      message: `Successfully archived ${result.archived} events`,
      data: result
    });
  } catch (error) {
    console.error('Error triggering archival:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive events'
    });
  }
});

module.exports = router;
