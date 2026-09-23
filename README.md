# RipetiMy

Sito web per tutor privati: agenda e disponibilità in un unico posto, prenotazione delle lezioni gestita direttamente dagli studenti.

Stack: Vite + React + TypeScript, Tailwind CSS, TanStack Query, react-big-calendar, Supabase (Postgres + Auth).

## Comandi

```bash
npm install
npm run dev            # server di sviluppo
npm run build           # build di produzione (tsc -b && vite build)
npm run preview         # anteprima locale della build
```

Variabili d'ambiente richieste (vedi `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Struttura

- `src/features/` — un modulo per dominio (`auth`, `profile`, `availability`, `lessons`, `agenda`, `search`, `my-lessons`)
- `src/routes/` — routing e guardie (`ProtectedRoute`, `RoleGate`)
- `src/lib/` — client Supabase, query client, utility condivise
- `src/components/` — UI di base (`ui/`) e layout (`layout/AppShell`)

## Database

Schema e RPC gestiti direttamente sul progetto Supabase dedicato (non tramite CLI locale). Tabelle: `profiles` (con `role` tutor/studente), `availability_slots`, `lessons`. RPC `security definer` per le letture cross-utente: `search_tutors`, `get_tutor`, `get_tutor_availability`, `get_tutor_busy_windows`, `create_booking`, `cancel_lesson`.
