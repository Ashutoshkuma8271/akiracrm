import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

app.get('/api/health', (_req, res) => res.json({ ok: true, database: Boolean(supabase) }));
app.get('/api/customers', async (_req, res) => {
  if (!supabase) return res.json({ data: [], message: 'Add Supabase credentials to enable persistence.' });
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ data });
});
app.post('/api/customers', async (req, res) => {
  if (!supabase) return res.status(503).json({ error: 'Supabase is not configured.' });
  const { data, error } = await supabase.from('customers').insert(req.body).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ data });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Akira Fresh CRM API running on http://localhost:${port}`));
