# Adding a New Presentation

## Steps

1. **Create the folder structure**
   ```bash
   mkdir -p presentations/your-presentation-name/public/assets
   ```

2. **Create your slides file**
   ```bash
   # Copy from an existing presentation as a template
   cp presentations/hands-on-modeling/slides.md presentations/your-presentation-name/slides.md
   ```

3. **Add your assets**
   - Place images in `presentations/your-presentation-name/public/assets/` (Slidev's `public/` folder is copied to the dist root)
   - Reference them in slides.md with a leading slash: `/assets/image.png` (works in both `image:` frontmatter and markdown body — Slidev/Vite prepend the deploy base automatically)

4. **Add a dev script to package.json**
   ```json
   "dev:your-presentation": "slidev presentations/your-presentation-name/slides.md --open"
   ```

5. **Add a build step to `.github/workflows/deploy.yml`**
   ```yaml
   - name: Build your-presentation-name
     run: |
       bun run slidev build presentations/your-presentation-name/slides.md \
         --base /presentations/your-presentation-name/ \
         --out ${{ github.workspace }}/dist/your-presentation-name
   ```

6. **Test locally**
   ```bash
   bun run dev:your-presentation
   ```

7. **Commit and push**
   - Your presentation will be available at: `https://jpjsolutions.com/presentations/your-presentation-name/`
   - That link is a redirect: this repo deploys to **GitHub Pages** at
     `https://jpjj.github.io/presentations/your-presentation-name/`, and the
     website (now on Cloudflare Pages) 302-redirects `/presentations/*` there
     via its `public/_redirects` — so both URLs work, no extra setup needed here.

## Directory Structure

```
presentations/
├── hands-on-modeling/
│   ├── slides.md
│   ├── public/
│   │   └── assets/
│   ├── components/
│   └── global-bottom.vue
│
└── your-presentation-name/
    ├── slides.md
    └── public/
        └── assets/
```

## Notes

- Each presentation keeps its images under `public/assets/` (Slidev's per-slides `public/` directory is copied verbatim to the dist root)
- Reference images with leading-slash paths (`/assets/foo.png`) in slides.md — works for `image:` frontmatter, markdown `![](...)`, and `<img src="...">`
- The `--base` path in deploy.yml must match the URL path
- The `--out` path in deploy.yml is `dist/<presentation-name>` (no extra `presentations/` segment — the dist root maps to `jpjj.github.io/presentations/`, which `jpjsolutions.com/presentations/` redirects to)
- Hosting history: before the website moved to Cloudflare Pages (2026-06-15), these decks were served directly at `jpjsolutions.com/presentations/...` through the GitHub Pages custom domain. The Cloudflare move broke that path until the website added the `_redirects` rule (2026-07-03). If decks ever move off GitHub Pages, update that rule in the `jpjj.github.io` repo.
- Optionally copy `global-bottom.vue` and `components/` if you need them
