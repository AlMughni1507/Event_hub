const { query } = require('../db');

/**
 * Soft delete events that have ended
 * - Mark event as archived (is_active = FALSE)
 * - Keep certificates intact
 * - Keep registration history intact
 * - Event won't show in public listings but data preserved
 */
const archiveEndedEvents = async () => {
  try {
    console.log('🧹 Starting automatic event archival...');
    
    // Get current date/time
    const now = new Date();
    
    // Find events that have ended (event_date + 1 day < now)
    const endedEvents = await query(`
      SELECT 
        id, 
        title, 
        event_date,
        end_time
      FROM events 
      WHERE is_active = TRUE 
        AND status = 'published'
        AND CONCAT(event_date, ' ', COALESCE(end_time, '23:59:59')) < ?
    `, [now]);

    if (endedEvents.length === 0) {
      console.log('✅ No ended events to archive');
      return { archived: 0, events: [] };
    }

    console.log(`📦 Found ${endedEvents.length} ended events to archive`);

    // Archive each event (soft delete)
    const archivedEvents = [];
    for (const event of endedEvents) {
      try {
        // Update event status to archived
        await query(`
          UPDATE events 
          SET 
            is_active = FALSE,
            status = 'archived',
            updated_at = NOW()
          WHERE id = ?
        `, [event.id]);

        archivedEvents.push({
          id: event.id,
          title: event.title,
          event_date: event.event_date
        });

        console.log(`   ✓ Archived: ${event.title} (ID: ${event.id})`);
      } catch (err) {
        console.error(`   ✗ Failed to archive event ${event.id}:`, err.message);
      }
    }

    console.log(`✅ Successfully archived ${archivedEvents.length} events`);
    console.log('📋 Certificates and registration history preserved');

    return {
      archived: archivedEvents.length,
      events: archivedEvents
    };

  } catch (error) {
    console.error('❌ Error in archiveEndedEvents:', error);
    throw error;
  }
};

/**
 * Get user's event history (including archived events)
 * Shows all events user has participated in
 */
const getUserEventHistory = async (userId) => {
  try {
    const history = await query(`
      SELECT 
        e.id,
        e.title,
        e.event_date,
        e.location,
        e.status,
        e.is_active,
        r.registration_date,
        r.status as registration_status,
        r.attendance_status,
        c.id as certificate_id,
        c.certificate_code,
        c.issued_at as certificate_issued_at
      FROM registrations r
      INNER JOIN events e ON r.event_id = e.id
      LEFT JOIN certificates c ON c.registration_id = r.id
      WHERE r.user_id = ?
      ORDER BY e.event_date DESC
    `, [userId]);

    return history;
  } catch (error) {
    console.error('Error getting user event history:', error);
    throw error;
  }
};

/**
 * Get archived events (for admin view)
 */
const getArchivedEvents = async () => {
  try {
    const archived = await query(`
      SELECT 
        e.*,
        COUNT(DISTINCT r.id) as total_participants,
        COUNT(DISTINCT c.id) as total_certificates
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      LEFT JOIN certificates c ON c.event_id = e.id
      WHERE e.status = 'archived' OR e.is_active = FALSE
      GROUP BY e.id
      ORDER BY e.event_date DESC
    `);

    return archived;
  } catch (error) {
    console.error('Error getting archived events:', error);
    throw error;
  }
};

/**
 * Restore archived event (make it active again)
 */
const restoreArchivedEvent = async (eventId) => {
  try {
    await query(`
      UPDATE events 
      SET 
        is_active = TRUE,
        status = 'published',
        updated_at = NOW()
      WHERE id = ?
    `, [eventId]);

    console.log(`✅ Restored event ID: ${eventId}`);
    return true;
  } catch (error) {
    console.error('Error restoring event:', error);
    throw error;
  }
};

/**
 * Permanently delete event (hard delete)
 * WARNING: This will delete certificates and history too!
 */
const permanentlyDeleteEvent = async (eventId) => {
  try {
    // Delete in order due to foreign key constraints
    await query('DELETE FROM certificates WHERE event_id = ?', [eventId]);
    await query('DELETE FROM attendance WHERE event_id = ?', [eventId]);
    await query('DELETE FROM registrations WHERE event_id = ?', [eventId]);
    await query('DELETE FROM events WHERE id = ?', [eventId]);

    console.log(`🗑️ Permanently deleted event ID: ${eventId}`);
    return true;
  } catch (error) {
    console.error('Error permanently deleting event:', error);
    throw error;
  }
};

module.exports = {
  archiveEndedEvents,
  getUserEventHistory,
  getArchivedEvents,
  restoreArchivedEvent,
  permanentlyDeleteEvent
};
