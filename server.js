// ===== ShiftMate Backend Setup =====
const supabase = require('./supabaseClient');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(express.json());

// ===== Temporary Auth Middleware =====
const requireAuth = (req, res, next) => {
  console.log(`[Auth Stub] Accessing ${req.method} ${req.path}`);
  next();
};

// ===== Test Route =====
app.get('/', (req, res) => {
  res.send('Hey Tumi! ThE ShiftMate backend is running!******Welldone PapaBeniah!****** MamaBeniah is going to love this! *********');
});

// ===== User Routes =====
app.get('/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }

  res.json(data);
});

// ===== Shift Routes =====

// POST /shifts - Create a new shift
app.post('/shifts', requireAuth, async (req, res) => {
  const { user_id, start_time, end_time, type } = req.body;

  if (!user_id || !start_time || !end_time || !type) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['user_id', 'start_time', 'end_time', 'type']
    });
  }

  try {
    const { data, error } = await supabase
      .from('shifts')
      .insert([{ user_id, start_time, end_time, type }])
      .select();

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Error creating shift:', error);
      return res.status(500).json({ error: 'Failed to create shift' });
    }

    return res.status(201).json({
      message: 'Shift created successfully',
      shift: data[0]
    });

  } catch (err) {
    console.error('Unexpected error creating shift:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /shifts/:user_id - Retrieve shifts for a specific user
app.get('/shifts/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('user_id', user_id)
      .order('start_time', { ascending: false });

    console.log('Supabase shift fetch:', { data, error });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch shifts' });
    }

    return res.json(data);

  } catch (err) {
    console.error('Unexpected error fetching shifts:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== Mood Routes =====

// POST /mood - Log a mood entry
app.post('/mood', requireAuth, async (req, res) => {
  const { user_id, mood_level, note } = req.body;

  if (!user_id || !mood_level) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['user_id', 'mood_level']
    });
  }

  try {
    const { data, error } = await supabase
      .from('moods')
      .insert([{ user_id, mood_level, note }])
      .select();

    console.log('Supabase mood insert:', { data, error });

    if (error) {
      return res.status(500).json({ error: 'Failed to log mood' });
    }

    return res.status(201).json({
      message: 'Mood logged successfully',
      mood: data[0]
    });

  } catch (err) {
    console.error('Unexpected mood error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /mood/:user_id - Retrieve moods for a specific user
app.get('/mood/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mood logs:', error);
      return res.status(500).json({ error: 'Failed to fetch mood logs' });
    }

    return res.json(data);

  } catch (err) {
    console.error('Unexpected error fetching moods:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== Hydration Routes =====

// POST /hydration - Log a hydration event
app.post('/hydration', requireAuth, async (req, res) => {
  const { user_id, amount_ml } = req.body;

  if (!user_id || !amount_ml) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['user_id', 'amount_ml']
    });
  }

  try {
    const { data, error } = await supabase
      .from('hydration_events')
      .insert([{ user_id, amount_ml }])
      .select();

    console.log('Supabase hydration insert:', { data, error });

    if (error) {
      return res.status(500).json({ error: 'Failed to log hydration event' });
    }

    return res.status(201).json({
      message: 'Hydration event logged successfully',
      hydration: data[0]
    });

  } catch (err) {
    console.error('Unexpected hydration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /hydration/:user_id - Retrieve hydration logs
app.get('/hydration/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('hydration_events')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching hydration events:', error);
      return res.status(500).json({ error: 'Failed to fetch hydration events' });
    }

    return res.json(data);

  } catch (err) {
    console.error('Unexpected error fetching hydration events:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
