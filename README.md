# Value Date

**A Choose-Your-Own-Provisioning gamebook about setting up an IronClaw-style AI agent on a payments desk.**

You are the operator at Quillon, a company that moves money for other companies. Today you switch on Bursar, an agent that will work the settlement desk. Nine configuration decisions, one ordinary Thursday, eight endings — and the ending is a pure function of your choices, not of luck.

**[▶ Start the adventure](https://silvermanjonathan.github.io/ironclaw-provisioning-adventure/)** — or open `index.html` locally.

## What this is

Training fiction for the people who provision agents. Each of the nine decisions maps to a real IronClaw configuration choice:

| Page | Decision | IronClaw mechanism |
|---|---|---|
| 2 | Where the keys live | Secrets management — system keyring vs. environment variable |
| 6 | The sandbox | Per-tool WASM / container isolation |
| 9 | How the feed arrives | The tunnel that exposes the agent's API |
| 13 | What the money key can do | Credential scope at the proxy boundary |
| 18 | Websites the rates tool may reach | The tool's declared host allowlist |
| 22 | Customer records in memory | Workspace memory scope |
| 28 | The community add-on | Skill trust — read / attenuated / trusted-unread |
| 32 | Limits on payments | Routine guardrails (rate limit, ceilings, spend cap) |
| 37 | The audit channel | Observability |

## What this is not

**No incident in this book happened.** Quillon, Bursar, and every character are invented, and no ending depicts a real event involving IronClaw or any other product. The story is *capability-grounded*: each mechanism is a credible answer to incidents that are documented and public, and the note printed at the end of every ending cites a real, verifiable case (EchoLeak / CVE-2025-32711, CVE-2025-6514, the Nx "s1ngularity" worm, the 1.5M-token exposure, the 135,000-instance scan, the runaway-loop cost case).

That distinction is the point. As of this writing there is no independent public record of a field save by any platform shipping these mechanics — and no public record of a field failure either. A story that implied otherwise would be teaching readers to trust vendor claims, which is roughly how the Thursday in this book happens.

The book never names a product, port, path, hostname, or configuration flag, and never states what any defence layer caught or missed. It teaches the shape of the decision, not a recipe.

Every safe choice is grounded in the IronClaw documentation — mostly verbatim recommendations, a few honest adaptations. The full page-by-page mapping, including which is which, is in [SOURCES.md](SOURCES.md), and readers get the short version in-book on [the builders' page](https://silvermanjonathan.github.io/ironclaw-provisioning-adventure/builders.html).

## Structure

Static multi-page site — no build step, no dependencies, no data leaves the page.

- `index.html` — cover and warning page
- `builders.html` — the note for builders (the docs-grounding map, linked from the cover)
- `01.html` … `53.html` — the pages; `45.html` is the reckoning, `46`–`53` the endings
- `engine.js` — carries the reader's ledger between pages in the URL (`?s=...`)
- `style.css` — shared styling

Edit any page's prose on its own without touching the rest. Two rules: page numbers live in both the filename and the `href` of every link that points to it, and choice links need `data-turn` on the `<a>` tag so the engine forwards the ledger.

*One page in this book is reachable by no link at all. There is a way to reach it. Maybe you'll find it.*
