# UcanPrjk01

Developer portfolio and open-source project hub for Android modules, tools and documentation.
Static site: HTML, CSS, vanilla JavaScript, SVG and JSON. No build step, no server, no paid service.

Live address (GitHub Pages): https://ucanprjk01.github.io/

## Folder structure

```
index.html, 404.html, robots.txt, sitemap.xml, .nojekyll
assets/   mascot, icons, images, illustrations, fonts
css/      style.css (design tokens + components), responsive.css, animations.css
js/       theme, components, main, data, search, projects, modules, downloads, changelog, docs, github
data/     projects.json, modules.json, downloads.json, changelog.json, documentation.json
pages/    projects, modules, downloads, documentation, changelog, about, contact
```

## Run locally

Opening files directly from disk blocks `fetch()`, so serve the folder:

```
python -m http.server 8000
```

Then open http://localhost:8000/

## Edit content (JSON)

Leave out any field you do not know; empty fields are not shown and nothing is invented.

**data/projects.json**
```json
{ "projects": [ {
  "name": "Example", "description": "One sentence.", "category": "Tools",
  "version": "1.0.0", "status": "Stable", "devices": [], "tech": ["Kotlin"],
  "repo": "https://github.com/UcanPrjk01/example", "docs": "", "download": "",
  "featured": true, "updated": "2026-11-05" } ] }
```

**data/modules.json**: fields `name, description, type (magisk | kernelsu | apatch | customization), version, compatibility[], requirements[], install[], changelog[], repo, download, featured`.

**data/downloads.json**: fields `file, version, size, date (YYYY-MM-DD), platform[], url, release, sha256` (64 hex characters).
Download buttons appear only for real http(s) URLs.

**data/changelog.json**: fields `project, version, date, added[], improved[], fixed[], breaking[]`.

**data/documentation.json**: articles with `id, category, title, summary, content[]`. Block types: `p`, `h2`, `h3`, `list`, `olist`, `code` (with `lang`), `callout` (`tone`: info or warning). Use backticks in text for inline code.

Always validate after editing: `python -m json.tool data/projects.json`

## Deploy to GitHub Pages

1. Create a repository named `ucanprjk01.github.io` under the UcanPrjk01 account (public).
2. Upload everything in this folder to the repository root (index.html must be at the root).
3. Open Settings > Pages. Under Build and deployment choose "Deploy from a branch", branch `main`, folder `/ (root)`, and save.
4. Wait a minute, then open https://ucanprjk01.github.io/

`404.html` uses absolute paths (`/css/...`), which is correct for a user site at the domain root. If you host in a repository subfolder instead (for example `/site/`), change those paths in `404.html` and the `data-root` value.

## Custom domain (optional, later)

1. Buy a domain. In Settings > Pages enter it under Custom domain.
2. At your DNS provider add a CNAME record from `www` to `ucanprjk01.github.io`. For the bare domain add the four A records listed in GitHub's documentation.
3. Enable "Enforce HTTPS" once the certificate is ready.
4. Replace `https://ucanprjk01.github.io` with your domain in the `canonical` and `og:` tags, `sitemap.xml` and `robots.txt`.

## Cloudflare Pages or Netlify (optional)

- **Cloudflare Pages**: connect the GitHub repo, framework preset "None", build command empty, output directory `/`.
- **Netlify**: add new site from Git, build command empty, publish directory `.`.

## Limits of a static site

GitHub Pages cannot run server code, store secrets or authenticate users. Features that need a backend (contact form submission, comments, accounts) require an external free-tier service such as Formspree or a GitHub Discussions link. None is used here.
The "On GitHub" list uses the public GitHub API without a key and may be rate limited (shown as an error state, not a crash).

## Pending your input

- Real projects, modules, downloads and release notes in `data/`.
- Public email or social links (Contact page), if you want them shown.
- Logo: the mascot is used as the brand mark; replace `assets/mascot/chibi-01.png` to change it.
