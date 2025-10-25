const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

let ClubModel;
try { ClubModel = require('../models/Club'); } catch (e) { ClubModel = null; }
const UserModel = (() => { try { return require('../models/User'); } catch (e) { return null; } })();

// In-memory fallback
const inMemory = global.__INMEMORY_CLUBS__ = global.__INMEMORY_CLUBS__ || [
  { id: 1, name: 'Coding Club', description: 'Learn and practice coding', category: 'Technology', color: 'primary', nextMeeting: 'March 25, 2024', membersCount: 120 },
  { id: 2, name: 'Photography Club', description: 'Capture moments', category: 'Arts', color: 'creative', nextMeeting: 'March 27, 2024', membersCount: 85 }
];

// GET /api/clubs
router.get('/', async (req, res) => {
  if (ClubModel) {
    const docs = await ClubModel.find().sort({ createdAt: -1 }).lean();
    return res.json(docs);
  }
  return res.json(inMemory);
});

// POST /api/clubs - create a club (requires auth)
router.post('/', auth, async (req, res) => {
  const payload = req.body;
  if (ClubModel) {
    const club = new ClubModel(payload);
    // add creator as member
    if (req.user && req.user._id) {
      club.members = [req.user._id];
      club.membersCount = 1;
    }
    await club.save();
    return res.status(201).json(club);
  }
  const id = Date.now();
  const club = { id, ...payload, membersCount: 1 };
  inMemory.unshift(club);
  return res.status(201).json(club);
});

// POST /api/clubs/:id/join - join club (requires auth)
router.post('/:id/join', auth, async (req, res) => {
  const id = req.params.id;
  if (ClubModel) {
    const club = await ClubModel.findById(id);
    if (!club) return res.status(404).json({ error: 'Not found' });
    const userId = req.user._id;
    if (!club.members.map(String).includes(String(userId))) {
      club.members.push(userId);
      club.membersCount = (club.membersCount || 0) + 1;
      await club.save();
    }
    return res.json({ ok: true, club });
  }

  const idx = inMemory.findIndex((c) => String(c.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  inMemory[idx].membersCount = (inMemory[idx].membersCount || 0) + 1;
  return res.json({ ok: true, club: inMemory[idx] });
});

// POST /api/clubs/:id/leave - leave club (requires auth)
router.post('/:id/leave', auth, async (req, res) => {
  const id = req.params.id;
  if (ClubModel) {
    const club = await ClubModel.findById(id);
    if (!club) return res.status(404).json({ error: 'Not found' });
    const userId = req.user._id;
    const idx = club.members.map(String).indexOf(String(userId));
    if (idx !== -1) {
      club.members.splice(idx, 1);
      club.membersCount = Math.max(0, (club.membersCount || 1) - 1);
      await club.save();
    }
    return res.json({ ok: true, club });
  }

  const idx = inMemory.findIndex((c) => String(c.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  inMemory[idx].membersCount = Math.max(0, (inMemory[idx].membersCount || 1) - 1);
  return res.json({ ok: true, club: inMemory[idx] });
});

module.exports = router;
