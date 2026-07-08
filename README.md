# Pookie Date Portal 💘

A lightweight static GitHub Pages website for a cute cupid-themed date invitation.

## Files

- `index.html` — page structure
- `style.css` — pink gradient UI, animations, responsive design
- `app.js` — secret loving key, screen flow, moving No button, Formcarry email
- `.nojekyll` — tells GitHub Pages not to process this as a Jekyll site

## Secret loving key

The default key is:

```txt
sudiplovesyou
```

To change it, open `app.js` and update:

```js
const SECRET_LOVING_KEY = "sudiplovesyou";
```

The site always opens on the secret key page first.
## Formcarry email setup

When she confirms the date, the site sends email, date/time, and note to Formcarry.

1. Create a form at [formcarry.com](https://formcarry.com)
2. Copy your unique endpoint from the Setup tab, like `https://formcarry.com/s/XXXXXXXX`
3. Paste it into `app.js`:

```js
const FORMCARRY_ENDPOINT = "https://formcarry.com/s/JTMxGGywkV3";
```

Formcarry will email you each new submission. Keep your Formcarry API key in the dashboard only — never paste it into `app.js` or commit it to GitHub.

## Deploy to GitHub Pages

Push these files to the root of:

```txt
https://github.com/cupidpage/cupidpage.github.io
```

Because this is a `username.github.io`-style repository, GitHub Pages can serve the site from the repository root.

## Note

Responses are also saved in the visitor’s browser with `localStorage` as a backup. Email delivery goes through Formcarry, not GitHub Pages itself.
