# Value Date

**A Choose-Your-Own-Provisioning gamebook about setting up an IronClaw-style AI agent on a payments desk.**

You are the operator at Quillon, a company that moves money for other companies. Today you switch on Bursar, an agent that will work the settlement desk. Eleven configuration decisions, one ordinary Thursday, ten endings — and the ending is a pure function of your choices, not of luck.

Deaths keep book time, not story time: the reckless die within pages of the fatal choice (found by the scan, or by anyone with the handle), the merely hurried die in the small hours of page 64 before Thursday ever starts, and only the careful get the full Thursday, the response, and the reckoning. How deep you get into the book *is* the feedback. The single clean ending sits at the very bottom of it.

This printing reads like the originals: no on-page ledger, no read-backs, no visible conditions — the page you are standing on is the only state you see. For facilitators, the reckoning's silent priority order is: internet-open, open handle, stale build, unread-and-unattended, spilled keys, no limits, searchable years, small loss, blind, contained.

**[▶ Start the adventure](https://silvermanjonathan.github.io/ironclaw-provisioning-adventure/)** — or open `index.html` locally.

## What this is

Training fiction for the people who provision agents. Each of the eleven decisions maps to a real IronClaw configuration choice:

| Page | Decision | IronClaw mechanism |
|---|---|---|
| 2 | Where the keys live | Secrets management — system keyring vs. environment variable |
| 6 | The sandbox | Per-tool WASM / container isolation |
| 9 | How the feed arrives | The tunnel that exposes the agent's API |
| 13 | What the money key can do | Credential scope at the proxy boundary |
| 18 | Websites the rates tool may reach | The tool's declared host allowlist |
| 22 | Customer records in memory | Workspace memory scope |
| 55 | Who may speak to Bursar | Channel `dm_policy` — pairing (default) / allowlist / open |
| 28 | The community add-on | Skill trust — read / attenuated / trusted-unread |
| 32 | Limits on payments | Routine guardrails (rate limit, ceilings, spend cap) |
| 37 | The audit channel | Observability |
| 59 | The update | Staying current — `ironclaw-update` |

## What this is not

**No incident in this book happened.** Quillon, Bursar, and every character are invented, and no ending depicts a real event involving IronClaw or any other product. The story is *capability-grounded*: each mechanism is a credible answer to incidents that are documented and public, and the note printed at the end of every ending cites a real, verifiable case (EchoLeak / CVE-2025-32711, CVE-2025-6514, the Nx "s1ngularity" worm, the 1.5M-token exposure, the 135,000-instance scan, the runaway-loop cost case, and the patched-before-disclosure RCE, CVE-2026-25253).

That distinction is the point. As of this writing there is no independent public record of a field save by any platform shipping these mechanics — and no public record of a field failure either. A story that implied otherwise would be teaching readers to trust vendor claims, which is roughly how the Thursday in this book happens.

The story pages never name a product, port, path, hostname, or configuration flag, and never state what any defence layer caught or missed. They teach the shape of the decision, not a recipe. Page 54 — the Builder's Guide — is the one exception by design: it is where the product names live, and every losing ending points there.

Every safe choice is grounded in the IronClaw documentation — mostly verbatim recommendations, a few honest adaptations. The full page-by-page mapping, including which is which, is in [SOURCES.md](SOURCES.md). In-book, every ending routes the reader onward: an ending caused by a choice links to the section of [the Builder's Guide](https://silvermanjonathan.github.io/ironclaw-provisioning-adventure/builders.html) that teaches the concept behind that choice, and the one ending no choice caused links out to the IronClaw quickstart — if you can provision the fictional agent cleanly, go provision a real one.

## Structure

Static multi-page site — no build step, no dependencies, no data leaves the page.

- `index.html` — cover and warning page
- `builders.html` — the Builder's Guide, page 54 of the book (the docs-grounding map; every losing ending turns the reader to the section that decided it)
- `01.html` … `64.html` — the pages; `64.html` is the night watch, `45.html` the reckoning, `46`–`53` and `62`–`63` the endings
- `engine.js` — carries the reader's place between pages in the URL (`?s=...`), invisibly
- `style.css` — shared styling
- `authors-map.svg` — the current structure map, regenerated from the live link graph each printing

Edit any page's prose on its own without touching the rest. Three rules: page numbers live in both the filename and the `href` of every link that points to it; choice links need `data-turn` on the `<a>` tag so the engine forwards the reader's place; and if `engine.js` and pages change together, bump the `?v=` pin on every page, so a cached engine can never meet a newer page. Pages 45 and 64 route by engine — their destinations are computed, not written.

*One page in this book is reachable by no link at all. There is a way to reach it. Maybe you'll find it.*
