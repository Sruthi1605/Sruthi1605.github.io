# Portfolio

A dependency-free, single-page developer portfolio with case-study pages, a
dynamic resume PDF, and subtle animations. Deploy to GitHub Pages in minutes.

## Files

- `index.html` — main page (hero, about, projects, skills, experience, achievements, certifications, contact)
- `style.css` — dark/light themes, animations, case-study page styles
- `script.js` — theme toggle, animated counters, confetti, scroll progress, typewriter, cursor trail, scroll reveals
- `case-studies/` — 4 detailed project pages, linked from `index.html`:
  - `sepsis-early-warning.html`
  - `fall-detection.html`
  - `collaborative-code-editor.html`
  - `secure-messaging.html`
- `resume.pdf` — YOUR resume file. Drop your own PDF here (the download
  buttons point to `resume.pdf`). Update the `href` in `index.html` if you use
  a different filename.

## Personal details to fill in

| Placeholder | Where |
| --- | --- |
| `#` links | LinkedIn / LeetCode links — add your real URLs |
| Project descriptions | fine-tune wording under each project card |
| Case study content | edit files in `case-studies/` to match your exact work |
| Resume PDF | copy your own resume into the project root as `resume.pdf` |
| Live terminal lines | the terminal card in the About section of `index.html` |

## Adding your resume

Your resume must be at the exact path the buttons point to:

```
C:\Users\sruthi.g\Documents\Default Project\resume.pdf
```

1. Export/save your CV as a PDF.
2. Rename it to exactly `resume.pdf` and drop it in this folder (replacing nothing — it should be the only `resume.pdf`).
3. That's it — the **⬇ Resume** buttons in the hero and contact sections will now download it.

> Different filename? Update both `href="resume.pdf"` links in `index.html`, and commit the new file too.

## Deploy to GitHub Pages (github.io)

Your site will live at **https://sruthi1605.github.io**.

1. On GitHub, create a **new public repository** named exactly:

   ```
   Sruthi1605.github.io
   ```

   (The name must match your GitHub username for this URL to work.)

2. Get your site files up. Two options:

   **Option A — Git (recommended).** Install Git from https://git-scm.com, then in this folder run:

   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/Sruthi1605/Sruthi1605.github.io.git
   git push -u origin main
   ```

   **Option B — No git, upload in the browser.** On the empty repo page click **Add file → Upload files**, and drag all of these in: `index.html`, `style.css`, `script.js`, `resume.pdf`, the `case-studies/` folder, and `README.md`. Then **Commit changes**.

3. For a `username.github.io` repo, **Settings → Pages** is already set to the `main` branch root — no extra config.

4. Visit `https://sruthi1605.github.io` after ~1–2 minutes. Done.

> After deploy, the site must be **public** (not private) or Pages won't serve it.

## Customizing

- Theme: toggled by the **light bulb** button in the nav (persists via `localStorage`, default dark). Light-theme colors are set under `html[data-theme='light']` in `style.css`.
- Accent color: change `--accent` in `style.css`.
- Add more projects/skills/achievements: copy a `.project-card`, `.skill-group`, or `.award-card` block in `index.html`.
- Case-study styles: `.cs-*` rules near the bottom of `style.css`.
- Stats: edit numbers in the `.stats` section of `index.html` (`data-target`, `data-decimals`, `data-suffix`).
- Confetti: fires on any `mailto:` link; adjust colors in `CONFETTI_COLORS` in `script.js`.
- Animations respect `prefers-reduced-motion` automatically.