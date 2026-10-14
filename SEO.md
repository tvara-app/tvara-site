# Search and answer engines

How tvara.pages.dev gets found, what the code already does, and what only a person can do.

## Why it is not ranking yet

1. **No domain of its own.** The site lives on `tvara.pages.dev`, a shared Cloudflare host. `tvara.app` has no DNS. Search engines trust a site's own domain more, and moving later costs a migration.
2. **New and unlinked.** Almost nothing links to the site. Rankings for "tvara" and for long-chat queries follow links and mentions more than on-page work.
3. **Weak Bing coverage.** ChatGPT search, Copilot and DuckDuckGo read Bing's index. Pages missing from Bing are missing from those answers too.

The code side is done (below). The remaining steps are yours, in this order:

1. `npm run deploy` — builds, runs preflight, deploys, pings IndexNow.
2. Google Search Console: add the property, submit `/sitemap.xml`, request indexing for `/`, `/answers` and the six platform pages.
3. Bing Webmaster Tools: import from Search Console, submit the sitemap.
4. `npx wrangler login`, then `npm run domain` to attach `tvara.app`.
5. When `https://tvara.app` answers: set `ORIGIN` in `src/routes.js`, deploy, add Bulk Redirects (301) from each `tvara.pages.dev` page to the same path on `tvara.app`, and file a Change of Address in Search Console. Never redirect `tvara.pages.dev/thanks`: installed copies of the extension activate Pro there (`host_permissions` in its manifest), and adding `tvara.app` to the manifest would disable the extension for every user until they accept the new permission.
6. Work the off-page list below. This is the step that moves rankings.

## What the site already does

- One fixed origin (`ORIGIN` in `src/routes.js`) for every canonical, sitemap entry, `og:url` and schema `@id`. Preflight fails the deploy if the origin drifts.
- Every page is static HTML. Crawlers and answer engines get the full text without running JavaScript.
- `ROUTES` in `src/routes.js` drives nav, prerender, sitemap and `llms.txt`, so a new page cannot be forgotten by any of them.
- Structured data: Organization, WebSite and SoftwareApplication (with keywords) on the home page. BreadcrumbList on every other page. Article and FAQPage on every answer. FAQPage on `/faq` and every platform page. HowTo on `/guide`. DefinedTermSet on the glossary. ItemList on `/answers`.
- `llms.txt` and `llms-full.txt` give answer engines the whole library as plain text, including every FAQ and glossary term.
- Honest `lastmod`: each article's `updated` date feeds the sitemap and `dateModified`.
- IndexNow pings Bing and Yandex on every deploy.
- Every article lists its primary sources (the AI companies' help pages, web.dev, MDN) under the text and as `citation` in its Article schema, and shows the date its text last changed with a byline linking to `/about`.
- `/about` says what Tvara is, how it handles data and how the site is written, with AboutPage schema. Organization schema lists the store and the GitHub organisation in `sameAs`.
- The first screen paints from the HTML: the arrival animation hides only blocks that start below the fold, so LCP never waits on JavaScript.
- Hub and spokes: every article's byline links to the hub, `/answers/long-chat-toolkit`, and every article lists the rest. Every page is two clicks or fewer from `/`.
- Entities: each Article names what it is `about` (the assistants in its title) and what it `mentions` (in its body), tied to Wikipedia with `sameAs`, so a vague query resolves to the right product.
- Images: five real screenshots on `/features` (WebP, 640 and 1280 wide, lazy, fixed size so nothing shifts), each with alt text that says what it shows. The same list feeds SoftwareApplication `screenshot` and the image sitemap. One list, `src/shots.js`.
- Heading outline: one `h1` per page and no skipped levels. Card and accordion titles are `h2` with the `h3` class for size, never a bold paragraph styled as a heading or a heading used for size.
- Titles 63 characters or fewer, descriptions 70 to 160, with the page's main phrase first.

## Keyword map

One page per search intent. Before adding a page, check that the intent is not already covered here.

| Cluster | People type | Page |
| --- | --- | --- |
| Brand | tvara, tvara extension, tvara chrome | `/`, `/features`, `/faq` |
| Category | long chat extension, long chat toolkit, AI chat manager, chat handler, long conversation tool | `/`, `/answers/long-chat-toolkit`, `/answers/choosing-an-ai-chat-extension` |
| Per assistant | ChatGPT extension, Claude extension, Gemini extension, DeepSeek, Grok, Perplexity extension | the six platform pages |
| Speed | ChatGPT slow long chat, chat lagging, browser freezes, page unresponsive, fix from forums | `why-long-ai-chats-get-slow` (with forum fixes checked), `ai-chat-freezes-browser`, `ai-chat-wont-load` |
| Navigation | jump to message, chat outline, minimap, scroll long chat | `jump-to-message-in-long-chat`, `read-long-ai-answers` |
| Search | search old ChatGPT chats, find a conversation, ChatGPT search not finding chat | `search-old-ai-conversations`, `organize-ai-conversations` |
| Context | context window, context handling, context management, AI forgets, conversation too long | `why-ai-forgets-conversation`, `conversation-too-long-context-limit`, `claude-conversation-too-long`, `continue-conversation-in-new-chat`, `ai-chat-glossary` |
| Limits | Claude usage limit, Gemini limit after a few prompts, ChatGPT limit, message cap, rate limit reset | `claude-usage-limits`, `gemini-usage-limits`, `check-ai-usage-limits`, `how-many-messages-in-one-chat` |
| Export and backup | export ChatGPT, Claude or Gemini chat, save as Markdown or PDF, back up AI chats | `export-chatgpt-conversation`, `export-claude-conversation`, `export-gemini-conversation`, `export-ai-chat-history`, `automatic-backup-ai-chats`, `save-notes-from-ai-chats` |
| Recovery | recover deleted ChatGPT chat | `recover-deleted-ai-chat` |
| Timestamps | when was a ChatGPT message sent | `see-when-ai-message-was-sent` |
| Privacy | is AI chat history private | `is-ai-chat-history-private` |
| Several assistants | use ChatGPT and Claude together | `using-multiple-ai-assistants` |
| Definitions | what is a token, context window, compaction | `ai-chat-glossary` |

Forum-style queries ("… reddit", "… not working", "… fix") are answered inside the page that owns the intent, as a section that checks each fix people suggest, not as a new page per phrasing. Near-duplicate pages for query variations are doorway pages under Google's spam policies. Reddit blocks most research crawlers, so never quote a thread you could not read.

Gaps worth a page next: ChatGPT memory versus chat history (once OpenAI's memory settings stop changing), and a fair comparison of long chat extensions.

## Adding an article

1. Add the HTML to `src/content/answers/` and an entry to `src/answers.js`.
2. The first paragraph starts `Short answer:` and answers the question on its own in one or two sentences. Answer engines quote it.
3. The `h1` and `title` use the words people type, not house words.
4. `faq` is required. Two or three questions, phrased as searches, each answer true on its own. It renders on the page and becomes FAQPage schema.
5. Set `updated` only when the content changes. A date bumped without a change teaches crawlers to ignore it.
6. Add `sources`: the official help page or platform doc behind each claim about another product. Never cite another blog.
7. Link to at least two related articles and the relevant platform page. Add the new article to that platform's `related` list in `src/platforms.js`.
8. Match the extension's real gating. The speed engine, minimap, allowance tracking and archive export are free everywhere. The outline, in-chat search, timestamps and one-click export are free on ChatGPT, Perplexity, DeepSeek and Grok, and Pro (seven-day free trial) on Claude and Gemini.
9. `npm run build`, then check `dist/<slug>.html` for the title, the JSON-LD and the short answer.

## What the 2026 evidence says

Checked in October 2026. Most "GEO" advice online comes from vendors selling tracking tools; this is what has evidence or a statement from the search engine behind it.

- **Google AI Overviews and AI Mode use the normal index and normal ranking.** Google says no special markup is needed. A page that is not indexed cannot be cited. Indexing comes first.
- **Query fan-out.** AI Mode splits a question into sub-questions and cites the pages that answer those. One page per specific question, linked into a cluster, beats one broad page. That is why the library is many short articles with a toolkit page at the centre.
- **Citations follow sourced facts.** The Princeton GEO study found the largest lift from sourced statistics, quotations and inline citations of authoritative sources; keyword stuffing did nothing. Hence `sources` on every article.
- **Third-party mentions matter more than your own pages.** Reddit, YouTube, LinkedIn and Wikipedia are the most cited domains across ChatGPT, Perplexity and Google. Unlinked brand mentions count. This is the off-page list below.
- **Freshness.** Perplexity in particular favours recent pages. Re-check articles every quarter and change `updated` only when the text changes.
- **llms.txt.** Google says it ignores it; no AI company has confirmed using it. Kept because it costs nothing, not because it ranks.
- **FAQ rich results** show only for government and health sites since 2023. FAQPage markup stays because answer engines read it, not for stars in Google.
- **Core Web Vitals** thresholds: LCP under 2.5 s, INP under 200 ms, CLS under 0.1. The site is static and ships one 51 KB script, so the risk is low; check in Search Console's Core Web Vitals report once there is traffic.

## Chrome Web Store listing

The store listing ranks in Google on its own and is often the first result for a brand query.

- Never name ChatGPT, Claude, Gemini or other providers in the store title, summary or screenshots. The listing was rejected once for this. Describe the job instead: long AI chats, speed, search, backup.
- Title and short description carry the phrases people search: "Long AI Chat Toolkit" and "long chat toolkit". The copy lives in `~/tvara/store/listing.md` and the manifest; changing them needs a new package.
- The long description follows the same shape as an answer page: what it is, what it does (free and Pro marked), when it helps in the words people use, how to start, then a link to `/answers`.
- Use all five screenshots, each with a caption that states one benefit. Add a short demo video.
- Ratings: the popup asks once, quietly, after 10+ archived chats and 3+ days, never again after a rating or a second "Not now" (`rateAskDue` in `~/tvara/lib/product.js`). Store installs only. Never offer anything for a rating.
- The manifest's `homepage_url` points at the site. In the dashboard, also set the Official URL to the site; it must be a Search Console property on the same Google account as the developer account.
- Ship updates regularly. The store and Google both treat a recently updated item as maintained.
- Category: Productivity, then Tools, is the closest fit. Change it only together with the copy, so the listing never says one thing and is filed as another.

## Off-page checklist

Links and mentions from real places are what move a new site. Do these once each, honestly, and without paid links.

- Product Hunt launch.
- AlternativeTo: list Tvara as an alternative to other chat extensions.
- AI tool directories (There's An AI For That, Futurepedia, Toolify and similar).
- Reddit: answer real questions in relevant subreddits, within each subreddit's self-promotion rules.
- Show HN, with the technical story (static site, local-only data).
- A public GitHub repo or README describing the extension, linking to the site.
- A YouTube demo: a long chat before and after, titled with the searched words.
- A post on your own profiles (X, LinkedIn) with the link.

## Measuring

- Search Console → Performance: queries, impressions and position per page. Check weekly for the first two months.
- Search Console → Pages: anything "Discovered – currently not indexed" needs links pointing at it.
- Bing Webmaster Tools → Search Performance, for ChatGPT search and Copilot visibility.
- Search `site:tvara.pages.dev` (later `site:tvara.app`) to see what is indexed.
- Ask ChatGPT, Perplexity and Copilot "what extension makes long ChatGPT chats faster?" once a month and note whether Tvara is cited.

## Why it keeps working

- The origin is fixed and preflight blocks a deploy with a wrong canonical, so rankings are not split across hosts.
- Pages are static and fast, with no client rendering to break.
- `lastmod` is honest, so crawlers keep trusting it.
- IndexNow runs on every deploy, so changes reach Bing within hours.
- Content answers stable questions, not news, so it does not go stale.
