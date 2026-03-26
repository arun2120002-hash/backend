import express from 'express';
import Letter from '../models/Letter.js';

const router = express.Router();

// GET unread count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Letter.countDocuments({ isRead: false });
    res.json({ count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all letters (sorted newest first)
router.get('/', async (req, res) => {
  try {
    const letters = await Letter.find().sort({ createdAt: -1 });
    res.json(letters);
  } catch (err) {
    console.error('Error fetching letters:', err);
    res.status(500).json({ error: 'Server error fetching letters.' });
  }
});

// POST a new letter
router.post('/', async (req, res) => {
  try {
    const { name, title, song, body } = req.body;

    if (!name || !title || !song || !body) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const newLetter = new Letter({
      name,
      title,
      song,
      body,
    });

    const savedLetter = await newLetter.save();
    res.status(201).json(savedLetter);
  } catch (err) {
    console.error('Error saving letter:', err);
    res.status(500).json({ error: 'Server error saving letter.' });
  }
});

// DELETE a letter
router.delete('/:id', async (req, res) => {
  try {
    const deletedLetter = await Letter.findByIdAndDelete(req.params.id);
    if (!deletedLetter) {
      return res.status(404).json({ error: 'Letter not found.' });
    }
    res.json({ message: 'Letter deleted successfully.' });
  } catch (err) {
    console.error('Error deleting letter:', err);
    res.status(500).json({ error: 'Server error deleting letter.' });
  }
});

// PATCH mark letter as read
router.patch('/:id/read', async (req, res) => {
  try {
    const letter = await Letter.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!letter) {
      return res.status(404).json({ error: 'Letter not found.' });
    }
    res.json(letter);
  } catch (err) {
    console.error('Error marking letter as read:', err);
    res.status(500).json({ error: 'Server error marking letter as read.' });
  }
});

export default router;
