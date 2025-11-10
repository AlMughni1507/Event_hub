const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for performer photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/performers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'performer-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all performers for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const [performers] = await db.execute(
      'SELECT * FROM performers WHERE event_id = ? ORDER BY display_order ASC',
      [req.params.eventId]
    );
    res.json({ success: true, performers });
  } catch (error) {
    console.error('Error fetching performers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch performers' });
  }
});

// Create performer with photo upload
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { event_id, name, display_order } = req.body;
    const photo_url = req.file ? `/uploads/performers/${req.file.filename}` : null;

    const [result] = await db.execute(
      'INSERT INTO performers (event_id, name, photo_url, display_order) VALUES (?, ?, ?, ?)',
      [event_id, name, photo_url, display_order || 0]
    );

    res.json({
      success: true,
      performer: {
        id: result.insertId,
        event_id,
        name,
        photo_url,
        display_order: display_order || 0
      }
    });
  } catch (error) {
    console.error('Error creating performer:', error);
    res.status(500).json({ success: false, message: 'Failed to create performer' });
  }
});

// Update performer
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, display_order } = req.body;
    let updateFields = { name, display_order };

    if (req.file) {
      updateFields.photo_url = `/uploads/performers/${req.file.filename}`;
      
      // Delete old photo
      const [oldPerformer] = await db.execute('SELECT photo_url FROM performers WHERE id = ?', [req.params.id]);
      if (oldPerformer[0]?.photo_url) {
        const oldPath = path.join(__dirname, '..', oldPerformer[0].photo_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    await db.execute(
      'UPDATE performers SET name = ?, display_order = ?, photo_url = COALESCE(?, photo_url) WHERE id = ?',
      [name, display_order, updateFields.photo_url, req.params.id]
    );

    res.json({ success: true, message: 'Performer updated successfully' });
  } catch (error) {
    console.error('Error updating performer:', error);
    res.status(500).json({ success: false, message: 'Failed to update performer' });
  }
});

// Delete performer
router.delete('/:id', async (req, res) => {
  try {
    // Get performer photo to delete file
    const [performer] = await db.execute('SELECT photo_url FROM performers WHERE id = ?', [req.params.id]);
    
    if (performer[0]?.photo_url) {
      const photoPath = path.join(__dirname, '..', performer[0].photo_url);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await db.execute('DELETE FROM performers WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Performer deleted successfully' });
  } catch (error) {
    console.error('Error deleting performer:', error);
    res.status(500).json({ success: false, message: 'Failed to delete performer' });
  }
});

// Bulk create performers for an event
router.post('/bulk', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { event_id, performers } = req.body;
    
    // Delete existing performers for this event
    await connection.execute('DELETE FROM performers WHERE event_id = ?', [event_id]);
    
    // Insert new performers
    if (performers && performers.length > 0) {
      for (let i = 0; i < performers.length; i++) {
        const p = performers[i];
        await connection.execute(
          'INSERT INTO performers (event_id, name, photo_url, display_order) VALUES (?, ?, ?, ?)',
          [event_id, p.name, p.photo_url || null, p.display_order !== undefined ? p.display_order : i]
        );
      }
    }
    
    await connection.commit();
    res.json({ success: true, message: 'Performers saved successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error bulk creating performers:', error);
    res.status(500).json({ success: false, message: 'Failed to save performers' });
  } finally {
    connection.release();
  }
});

module.exports = router;
