# Tennis-Coach

Persönlicher Tennis-Trainings- und Match-Tracker mit einem KI-gestützten Coach-Chat.

## Tech-Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **PostgreSQL** via **Prisma ORM** (driver adapter `@prisma/adapter-pg`)
- **Auth.js (NextAuth v5)**, Credentials Provider (E-Mail/Passwort)
- **`@anthropic-ai/sdk`** für den streamenden KI-Coach-Chat (Modell `claude-sonnet-5`)
- `zod`, `react-hook-form`, `date-fns`, `recharts`

## Setup

1. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

2. `.env` anlegen (siehe `.env.example`):

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: PostgreSQL-Verbindungsstring (lokal, Neon oder Supabase)
   - `AUTH_SECRET`: mit `openssl rand -base64 32` generieren
   - `ANTHROPIC_API_KEY`: Anthropic API-Key für den Coach-Chat

3. Datenbank-Migrationen anwenden:

   ```bash
   npx prisma migrate dev
   ```

4. Dev-Server starten:

   ```bash
   npm run dev
   ```

## Features

- **Auth**: Registrierung/Login per E-Mail & Passwort, Middleware schützt alle Routen außer `/login` und `/register`.
- **Dashboard**: Trainingsvolumen (7/30 Tage), Match-Bilanz, Trend-Charts (1. Aufschlag-%, Unforced Errors), letztes Coach-Fazit.
- **Trainings-Log**: CRUD für Trainingseinheiten (Datum, Dauer, Art, Fokusbereiche, Intensität, Notizen).
- **Match-Log**: CRUD für Matches inkl. Stats (Asse, Doppelfehler, Winner, Unforced Errors, 1. Aufschlag-%).
- **Profil**: Spielniveau, Spielhand, Ziele, Stärken/Schwächen, sowie manuell gepflegte ÖTV/OÖTV-Daten (Rangliste, ITN-Wert, Profil-Link) — es gibt keinen automatischen Sync mit dem Verbandsportal.
- **KI-Coach**: Streaming-Chat, der Antworten auf Basis der echten geloggten Trainings-, Match- und Profildaten gibt. Konversationen werden persistiert.

## Deployment

Empfohlen: **Vercel** (App) + **Neon/Supabase** (Datenbank, Free Tier).

Benötigte Umgebungsvariablen in der Deployment-Umgebung setzen: `DATABASE_URL`, `AUTH_SECRET`, `ANTHROPIC_API_KEY`. Bei Neon den *pooled* Connection-String verwenden.
