# The Daily Kava — Content Engine (Phase 3 first slice)

Automates **discovery → draft → compliance check → human approval queue**.  
**Nothing auto-publishes to the live site.** You approve drafts, then paste/merge into `daily-kava.js` and deploy the reviewed site to Azure.

## Quick start

```bash
cd ~/tribal-kava-lounge/daily-engine

# 1) Fetch Google News RSS + other feeds, dedupe, write candidates
python3 run_daily.py fetch

# 2) Draft a short digest from new candidates (template + optional LLM)
python3 run_daily.py draft

# 3) Run v0 Compliance API (rules checker) on drafts/
python3 run_daily.py check

# 4) List queue status
python3 run_daily.py status

# Full pipeline (fetch → draft → check)
python3 run_daily.py run
```

Optional LLM (OpenAI-compatible env):

```bash
export OPENAI_API_KEY=...
export OPENAI_MODEL=gpt-4o-mini   # optional
python3 run_daily.py draft --llm
```

Without an API key, drafts use a **compliant template** from feed titles + links (safe default).

## Layout

| Path | Purpose |
|------|---------|
| `sources.json` | RSS / Google News query list |
| `state/seen_urls.json` | Dedupe store |
| `state/queue.json` | Draft statuses: drafted / passed / failed / approved / published |
| `drafts/` | Markdown drafts awaiting human review |
| `compliance.py` | v0 Compliance API (deterministic rules from §3) |
| `run_daily.py` | CLI orchestrator |

## Human gate

1. Open `drafts/*.md` files with status `passed` in `state/queue.json`
2. Edit voice/facts as needed
3. Re-run `python3 run_daily.py check --file drafts/your-file.md`
4. Mark approved: `python3 run_daily.py approve drafts/your-file.md`
5. Manually add the post to `../daily-kava.js`
6. From the repository root, run `npm run deploy:azure` (publish step is intentional)

## Cron (optional)

```cron
# 6am ET ≈ 10/11 UTC depending on DST — adjust
0 11 * * * cd /Users/jd/tribal-kava-lounge/daily-engine && /usr/bin/python3 run_daily.py run >> logs/cron.log 2>&1
```

## Compliance note

Kratom/kava content is claim-sensitive. This pipeline **never** posts to Instagram or the live Azure site by itself. Fan-out captions can be drafted later behind the same checker + human gate.
