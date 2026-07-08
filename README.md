# Pookie Date Portal (GitHub Pages ideation)

A static, multi-experience invite playground for planning a **date** or **trip** with a secret key, quiz, runaway No button, and Formcarry confirmation.

This is an **ideation prototype**, not a full SaaS. There is no real login, database, or billing yet.

## Live demos

- Default date night: [https://cupidpage.github.io/](https://cupidpage.github.io/)
- Travel demo: [https://cupidpage.github.io/?e=demo](https://cupidpage.github.io/?e=demo)
- Ideation builder: [https://cupidpage.github.io/create.html](https://cupidpage.github.io/create.html)

Default secret key: `sudiplovesyou`  
Travel demo key: `letsgo`

## How “multi-experience” works on Pages

Creators are simulated with **named configs** in [`experiences.js`](experiences.js), not accounts.

1. Add or edit an object under `EXPERIENCES`.
2. Push to GitHub Pages.
3. Share `https://cupidpage.github.io/?e=yourSlug`.

Unknown `?e=` values fall back to `default`.

You can also open a **preview** URL from `create.html` (`?preview=...`). Preview configs live only in the URL — they are not saved on a server.

## Files

- `index.html` / `style.css` / `app.js` — invite experience
- `experiences.js` — date + travel configs + URL resolver
- `create.html` / `create.css` / `create.js` — static ideation builder
- `.nojekyll` — GitHub Pages static serving

## Formcarry

Each experience can set its own `formcarry` URL. Confirms send:

- email, date/time, note
- experience id / title / template
- each quiz answer field (e.g. `cuisine`, `dessert`, or `destination`, `budget`)
- `quiz_answers` summary

Keep your Formcarry **API key** in the dashboard only — never commit it.

## Pages limits (honest)

GitHub Pages cannot:

- store per-user accounts
- persist builder data for everyone globally
- run Stripe billing

For durable public experiences today: paste JSON into `experiences.js` and redeploy.  
`create.html` is for local ideation (preview link / download / copy snippet).

## Future SaaS path

When ideation validates demand:

- Auth + owned experiences in a database
- Visual builder UI with true persistence
- Share links per tenant
- Stripe subscriptions / freemium

Seed that product from the templates already in `experiences.js`.

## Deploy

Push the site root to:

```txt
https://github.com/cupidpage/cupidpage.github.io
```

GitHub Pages serves from `main` `/` → [https://cupidpage.github.io](https://cupidpage.github.io)
