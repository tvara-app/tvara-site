# tvara-site

The site for Tvara, the long chat extension for Chrome and Edge:
<https://tvara.pages.dev>. Authored in React, rendered to static HTML at build
time, served from Cloudflare Pages.

## No framework in the browser

React is a build-time tool here. `prerender.mjs` renders every route with
`react-dom/server` and writes a real HTML file with its own title, description,
canonical, Open Graph tags and JSON-LD. Nothing hydrates. The only script the
reader downloads is `src/client.js` — GSAP plus about two hundred lines that add
motion to markup that is already complete. With JavaScript blocked, every page,
including all the FAQ answers, still reads.

The first screen paints straight from the HTML: the hero title animates in CSS,
and the script hides only blocks that start below the fold. Largest Contentful
Paint never waits on JavaScript.

Navigation is ordinary links: one file per page, no client-side router.

## Commands

```bash
npm run build     # client assets, SSR bundle, prerender, sitemap, robots, llms.txt, llms-full.txt
npm run preview   # build, then serve dist/ locally
npm run deploy    # build, preflight, deploy to Pages, ping IndexNow
npm run indexnow  # ping IndexNow alone
npm run domain    # attach tvara.app to the Pages project
```

There is no dev server: `index.html` exists only so Vite emits the stylesheet
and the script. Use `npm run preview` and reload.

## Structure

- `src/routes.js` — the one list of pages. It drives the nav bar, the
  breadcrumbs, the prerenderer, the sitemap and `llms.txt`, so a page cannot
  exist in one of them and be missing from another. `ORIGIN`, price, store link
  and support address live here too.
- `src/answers.js` — the answer library: each article's title, FAQ, sources,
  glossary terms and `updated` date. `src/content/answers/*.html` holds the
  article bodies.
- `src/platforms.js` — one page per supported AI site, with its related
  answers. Bodies in `src/content/platforms/*.html`.
- `src/entry-server.jsx` — renders a route and builds its JSON-LD:
  Organization, WebSite and SoftwareApplication on the home page;
  BreadcrumbList elsewhere; Article (with `citation`) and FAQPage on answers;
  DefinedTermSet on the glossary; ItemList on `/answers`; HowTo on `/guide`;
  AboutPage on `/about`.
- `src/pages/*.jsx` — one component per page type. `NotFound.jsx` becomes
  `404.html`.
- `src/content/*.html` — About, privacy policy, terms and refunds, as one
  document each.
- `src/components/Simulation.jsx` — the chat window on the home page: four
  states (speed engine, map, search, outline) played inside a mock chat site and
  selectable by tab. The controller is in `src/client.js`.
- `src/styles.css` — the extension's own tokens at page scale: the popup's warm
  plate, its hairlines, its type. Every animation sits behind
  `prefers-reduced-motion`.
- `static/` — copied into `dist/` verbatim: icons, logo, social card, the
  IndexNow key and `_headers`.
- `public/` — Search Console verification files.
- `tools/` — `preflight.mjs` (refuses a deploy whose canonical host does not
  answer), `indexnow.mjs`, `attach-domain.mjs`.

Output is flat: `/answers/long-chat-toolkit` is
`dist/answers/long-chat-toolkit.html`.

## Search and answer engines

`SEO.md` is the playbook: why the site ranks where it does, the keyword map,
the rules for adding an article, the store listing, the off-page checklist and
how to measure. Read its "Adding an article" section before writing one. Every
claim about another product links to that company's own help page, and
`updated` moves only when the text does.

## Serving and cost

The site is a Cloudflare Pages project (`tvara`). Files are served from the
edge with no Worker invoked, which is free and unmetered. Adding a Pages
Function (for a redirect, say) would make requests billable, so response
headers come from `static/_headers` instead. Preview deployments get
`X-Robots-Tag: noindex` there.

`ORIGIN` in `src/routes.js` is the address the pages call themselves:
canonicals, sitemap, OG tags, llms.txt and IndexNow all read it. There is no
environment override, and `npm run deploy` refuses to ship if that host does
not answer.

**`tvara.pages.dev/thanks` must keep working.** Installed copies of the
extension activate Pro there (`host_permissions` in its manifest), so it can
never redirect.

Moving to tvara.app:

1. `npx wrangler login`, then `npm run domain`. It attaches tvara.app and waits
   until the domain answers.
2. Set `ORIGIN` to `https://tvara.app`, then `npm run deploy`.
3. 301 every tvara.pages.dev path except `/thanks` to tvara.app with a
   Cloudflare Bulk Redirect (preserve path and query). `_redirects` cannot match
   on host.
4. Search Console: add tvara.app as a Domain property, submit `/sitemap.xml`,
   and file a Change of Address from the tvara.pages.dev property. Bing
   Webmaster Tools can import the site from Search Console.
