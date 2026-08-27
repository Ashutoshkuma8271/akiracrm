# Akira Fresh CRM

A premium customer relationship workspace for Akira Fresh, built with React, Express, and Supabase-ready persistence.

## Run locally

```bash
npm install
npm run dev
```

The Vite frontend runs at `http://localhost:5173`.

To enable the API and Supabase persistence:

1. Copy `.env.example` to `.env`.
2. Add your Supabase URL and service-role key.
3. Run `supabase-schema.sql` in the Supabase SQL editor.
4. Start the API with `npm run server`.

The dashboard currently includes seeded customer data so the core workflow is usable without a database: search, segment filters, customer selection, profile details, retention insight, toast feedback, import feedback, and add-customer flow.
