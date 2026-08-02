# Safar

Book buses, trains and flights across Bangladesh from one search. Real seat
availability, the full fare up front, and nothing added at the last step.

Built with SvelteKit, Svelte 5, Tailwind 4, Drizzle and libSQL.

## Getting started

```sh
pnpm install
cp .env.example .env
pnpm db:reset   # creates the schema, then seeds it
pnpm dev
```

`pnpm db:reset` generates around 239,000 departures over a 60 day window and takes a
few seconds. Pass a shorter window while iterating:

```sh
pnpm db:seed --days=7
```

## Environment

Every variable is validated at boot, so a missing or malformed value fails immediately
rather than silently falling back.

| Variable              | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `DATABASE_URL`        | libSQL connection string. `file:local.db` locally, `libsql://…` for Turso. |
| `DATABASE_AUTH_TOKEN` | Required only for a remote database. Leave empty for a local file.         |
| `PUBLIC_SITE_URL`     | Absolute origin, used for canonical links and Open Graph tags.             |

## How it fits together

```
src/lib/
  domain/       mode-agnostic types and pure logic — fares, seat maps, geography
  format/       Intl wrappers; no hand-rolled date or currency formatting
  errors/       the error catalog, and the only place user-facing failure copy lives
  components/   UI primitives and feature components
  server/
    db/         Drizzle schema and client
    repos/      data access — the seam a real backend slots into
    seed/       deterministic generator and the Bangladesh catalog
```

Seats are **derived**, not stored. A departure keeps a layout id and a seed; the seat
map is rebuilt from those and layered with real reservations from `trip_seat`. That is
what keeps millions of seats free of storage cost while staying reproducible.

Input validation is written once with valibot and runs in both places: the browser via
`form.preflight(schema)`, and the server inside the remote function.

## Commands

| Command                     | Does                              |
| --------------------------- | --------------------------------- |
| `pnpm dev`                  | Development server                |
| `pnpm build`                | Production build                  |
| `pnpm check`                | Type-check                        |
| `pnpm lint` / `pnpm format` | Lint and format                   |
| `pnpm test`                 | Unit and end-to-end tests         |
| `pnpm db:push`              | Apply the schema                  |
| `pnpm db:seed`              | Seed data (`--days=N` to shorten) |
| `pnpm db:reset`             | Schema then seed                  |
| `pnpm db:studio`            | Browse the database               |

## Deploying to Vercel

The app builds with `@sveltejs/adapter-vercel` on the Node runtime, pinned to `bom1`
(Mumbai) so the functions sit beside the Turso database rather than a continent away.

Set these three variables in the Vercel project, for every environment you deploy:

| Variable              | Value                                                  |
| --------------------- | ------------------------------------------------------ |
| `DATABASE_URL`        | `libsql://safar-ebnsina.aws-ap-south-1.turso.io`       |
| `DATABASE_AUTH_TOKEN` | A Turso token — `turso db tokens create safar-ebnsina` |
| `PUBLIC_SITE_URL`     | The deployment origin, e.g. `https://safar.vercel.app` |

All three are read when the app starts, not inlined at build time, so changing one in
Vercel takes effect on redeploy without a rebuild. `PUBLIC_SITE_URL` is the only one
exposed to the browser; the other two stay server-only and are unavailable to client
code by construction.

Every value is validated at boot. A malformed `DATABASE_URL`, or a remote URL with no
token, fails the deployment immediately rather than serving broken pages.

Set them for **Production, Preview and Development**. They are needed at build time as
well as at run time — SvelteKit imports server modules while analysing the build — so a
missing value fails the deploy rather than the first request.

### Seeding production

Put the credentials in `.env.seed`, which is gitignored:

```sh
DATABASE_URL="libsql://safar-ebnsina.aws-ap-south-1.turso.io"
DATABASE_AUTH_TOKEN="…"
```

Then, once:

```sh
pnpm db:push:remote --force   # create the schema
pnpm db:seed:remote           # load the data
```

The file is deliberately **not** called `.env.production`: Vite auto-loads that name
during `vite build`, which would both break the build and bake production credentials
into it. Seeding is a one-off data load and is never part of the deploy.

## Adding a market

Safar ships with Bangladesh. To add another:

1. Add a catalog folder under `src/lib/server/seed/catalog/<region>/`.
2. Add the region to `src/lib/config/region.ts` with its locale, currency, time zone
   and supported modes.

No schema, repository or interface changes are needed — rows carry their own region
and currency, and all formatting reads the active region's locale.

## Note

Operators, routes and timetables are modelled on real services, but every fare, seat
and departure is generated. No tickets are sold and no payment details are stored.
