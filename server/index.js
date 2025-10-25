require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Auth routes (Google sign-in will be handled here)
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
} catch (e) {
  console.warn('Auth routes not loaded:', e.message || e);
}

// Clubs routes
try {
  const clubsRoutes = require('./routes/clubs');
  app.use('/api/clubs', clubsRoutes);
} catch (e) {
  console.warn('Clubs routes not loaded:', e.message || e);
}

// Support either MONGO_URI or MONGODB_URI for flexibility (some projects use different names)
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
let mongoose;
let EventModel;
let LostFoundModel;

if (mongoUri) {
  try {
    mongoose = require('mongoose');
    // The mongoose driver >=4 handles parser/topology automatically; avoid deprecated options
    mongoose.connect(mongoUri)
      .then(() => console.log('MongoDB connected'))
      .catch((err) => console.error('MongoDB connection error', err));

    const { Schema } = mongoose;
    const EventSchema = new Schema({
      title: String,
      date: String,
      time: String,
      location: String,
      attendees: { type: Number, default: 0 },
      category: String,
      color: String,
      description: String,
    }, { timestamps: true });

    const LostFoundSchema = new Schema({
      title: String,
      location: String,
      time: String,
      type: { type: String, enum: ['lost','found'], default: 'lost' },
      description: String,
      reportedBy: String,
    }, { timestamps: true });

    EventModel = mongoose.model('Event', EventSchema);
    LostFoundModel = mongoose.model('LostFound', LostFoundSchema);
  } catch (e) {
    console.warn('Failed to load mongoose', e);
  }
} else {
  console.warn('MONGO_URI not set — running in demo mode with in-memory data (no persistence)');
}

// In-memory stores as fallback
const inMemory = {
  events: [
    { id: 1, title: 'Tech Talk 2024', date: 'March 25, 2024', time: '2:00 PM', location: 'Auditorium A', attendees: 150, category: 'Technology', color: 'primary', description: 'An industry tech talk' },
    { id: 2, title: 'Cultural Fest', date: 'March 28, 2024', time: '10:00 AM', location: 'Main Ground', attendees: 500, category: 'Cultural', color: 'creative', description: 'Campus cultural fest' }
  ],
  lostfound: [
    { id: 1, title: 'Blue Backpack', location: 'Library', time: '2 hours ago', type: 'lost', color: 'primary', description: 'Blue bag with laptop inside' },
    { id: 2, title: 'Silver Water Bottle', location: 'Cafeteria', time: '5 hours ago', type: 'found', color: 'success', description: 'Stainless steel bottle' }
  ]
};

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Events routes
app.get('/api/events', async (req, res) => {
  if (EventModel) {
    const docs = await EventModel.find().sort({ createdAt: -1 }).lean();
    return res.json(docs);
  }
  return res.json(inMemory.events);
});

app.get('/api/events/:id', async (req, res) => {
  const id = req.params.id;
  if (EventModel) {
    const doc = await EventModel.findById(id).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  }
  const doc = inMemory.events.find((e) => String(e.id) === String(id));
  if (!doc) return res.status(404).json({ error: 'Not found' });
  return res.json(doc);
});

app.post('/api/events', async (req, res) => {
  const payload = req.body;
  if (EventModel) {
    const doc = new EventModel(payload);
    await doc.save();
    return res.status(201).json(doc);
  }
  const id = Date.now();
  const doc = { ...payload, id };
  inMemory.events.unshift(doc);
  return res.status(201).json(doc);
});

app.post('/api/events/:id/register', async (req, res) => {
  const id = req.params.id;
  if (EventModel) {
    const ev = await EventModel.findById(id);
    if (!ev) return res.status(404).json({ error: 'Not found' });
    ev.attendees = (ev.attendees || 0) + 1;
    await ev.save();
    return res.json(ev);
  }
  const idx = inMemory.events.findIndex((e) => String(e.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  inMemory.events[idx].attendees = (inMemory.events[idx].attendees || 0) + 1;
  return res.json(inMemory.events[idx]);
});

// Lost & Found
app.get('/api/lostfound', async (req, res) => {
  if (LostFoundModel) {
    const docs = await LostFoundModel.find().sort({ createdAt: -1 }).lean();
    return res.json(docs);
  }
  return res.json(inMemory.lostfound);
});

app.post('/api/lostfound', async (req, res) => {
  const payload = req.body;
  if (LostFoundModel) {
    const doc = new LostFoundModel(payload);
    await doc.save();
    return res.status(201).json(doc);
  }
  const id = Date.now();
  const doc = { ...payload, id };
  inMemory.lostfound.unshift(doc);
  return res.status(201).json(doc);
});

app.get('/api/lostfound/:id', async (req, res) => {
  const id = req.params.id;
  if (LostFoundModel) {
    const doc = await LostFoundModel.findById(id).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  }
  const doc = inMemory.lostfound.find((i) => String(i.id) === String(id));
  if (!doc) return res.status(404).json({ error: 'Not found' });
  return res.json(doc);
});

app.post('/api/lostfound/:id/claim', async (req, res) => {
  const id = req.params.id;
  if (LostFoundModel) {
    const doc = await LostFoundModel.findById(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    await doc.remove();
    return res.json({ ok: true, message: 'Claim submitted' });
  }
  inMemory.lostfound = inMemory.lostfound.filter((i) => String(i.id) !== String(id));
  return res.json({ ok: true, message: 'Claim submitted (demo)' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
