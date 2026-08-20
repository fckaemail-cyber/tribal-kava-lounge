#!/usr/bin/env python3
"""
The Daily Kava — fetch → dedupe → draft → compliance check → queue.

Usage:
  python3 run_daily.py fetch|draft|check|status|approve|run [--llm] [--file PATH]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

from compliance import check_text

ROOT = Path(__file__).resolve().parent
STATE_DIR = ROOT / "state"
DRAFTS_DIR = ROOT / "drafts"
SOURCES = ROOT / "sources.json"
SEEN_PATH = STATE_DIR / "seen_urls.json"
QUEUE_PATH = STATE_DIR / "queue.json"
CANDIDATES_PATH = STATE_DIR / "candidates.json"

UA = "TribalDailyKavaBot/1.0 (+https://tribalkavalounge.com; educational lounge content)"


def _ensure_dirs() -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    (ROOT / "logs").mkdir(parents=True, exist_ok=True)
    if not SEEN_PATH.exists():
        SEEN_PATH.write_text(json.dumps({"urls": {}}, indent=2))
    if not QUEUE_PATH.exists():
        QUEUE_PATH.write_text(json.dumps({"items": []}, indent=2))


def _load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text())


def _save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def _fetch_url(url: str, timeout: int = 25) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml, */*"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def google_news_rss_url(query: str) -> str:
    q = urllib.parse.quote_plus(query)
    return f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"


def parse_rss(xml_bytes: bytes) -> list[dict]:
    items = []
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return items

    # RSS 2.0
    for item in root.findall(".//item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub = (item.findtext("pubDate") or "").strip()
        source_el = item.find("source")
        source = (source_el.text or "").strip() if source_el is not None else ""
        desc = (item.findtext("description") or "").strip()
        # strip html tags lightly
        desc = re.sub(r"<[^>]+>", "", desc)
        if not title or not link:
            continue
        published = None
        if pub:
            try:
                published = parsedate_to_datetime(pub).astimezone(timezone.utc).isoformat()
            except Exception:
                published = pub
        items.append(
            {
                "title": title,
                "url": link,
                "published": published,
                "source": source,
                "summary": desc[:400],
            }
        )

    # Atom
    if not items:
        ns = {"a": "http://www.w3.org/2005/Atom"}
        for entry in root.findall("a:entry", ns):
            title = (entry.findtext("a:title", default="", namespaces=ns) or "").strip()
            link_el = entry.find("a:link", ns)
            link = link_el.get("href") if link_el is not None else ""
            if title and link:
                items.append({"title": title, "url": link, "published": None, "source": "", "summary": ""})

    return items


def cmd_fetch() -> int:
    _ensure_dirs()
    sources = _load_json(SOURCES, {"feeds": []})
    seen = _load_json(SEEN_PATH, {"urls": {}})
    candidates = []
    new_count = 0

    for feed in sources.get("feeds", []):
        fid = feed.get("id", "feed")
        category = feed.get("category", "general")
        if feed.get("type") == "google_news":
            url = google_news_rss_url(feed["query"])
        else:
            url = feed.get("url")
        if not url:
            continue
        try:
            raw = _fetch_url(url)
            entries = parse_rss(raw)
        except Exception as e:
            print(f"[warn] {fid}: {e}", file=sys.stderr)
            continue

        keywords = [k.lower() for k in feed.get("filter_keywords") or []]
        for entry in entries[:15]:
            if keywords:
                blob = f"{entry['title']} {entry.get('summary','')}".lower()
                if not any(k in blob for k in keywords):
                    continue
            url_key = entry["url"]
            url_hash = hashlib.sha256(url_key.encode()).hexdigest()[:16]
            if url_key in seen["urls"] or url_hash in seen["urls"]:
                continue
            seen["urls"][url_key] = {
                "hash": url_hash,
                "seen_at": datetime.now(timezone.utc).isoformat(),
                "feed": fid,
                "title": entry["title"],
            }
            candidates.append({**entry, "feed": fid, "category": category, "hash": url_hash})
            new_count += 1

    # Keep last run candidates for drafting
    prev = _load_json(CANDIDATES_PATH, {"items": []})
    # Merge unique by url
    by_url = {c["url"]: c for c in prev.get("items", [])}
    for c in candidates:
        by_url[c["url"]] = c
    merged = list(by_url.values())
    # Prefer newest first — no reliable date always
    _save_json(CANDIDATES_PATH, {"updated_at": datetime.now(timezone.utc).isoformat(), "items": merged[-40:]})
    _save_json(SEEN_PATH, seen)
    print(f"Fetched. New unique URLs: {new_count}. Candidate pool: {len(merged[-40:])}.")
    return 0


def _template_draft(items: list[dict], day: str) -> str:
    lines = [
        f"# The Daily Kava Digest — {day}",
        "",
        f"*Draft generated {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')} — human approval required before publish.*",
        "",
        "A short, original roundup of links worth knowing for West Palm Beach kava lounge culture — culture, regulation, and non-alcoholic social trends. We summarize in our own words and link out. We do not republish full articles.",
        "",
    ]
    for i, it in enumerate(items[:5], 1):
        cat = it.get("category", "news")
        lines.append(f"## {i}. {it['title']}")
        lines.append("")
        lines.append(
            f"**Category:** {cat} · **Source feed:** {it.get('feed', 'rss')}"
            + (f" · **Outlet:** {it['source']}" if it.get("source") else "")
        )
        lines.append("")
        if it.get("summary"):
            lines.append(f"Snippet context (not republished body): {it['summary'][:240]}")
            lines.append("")
        lines.append(
            f"What it means for Military Trail: worth a glance if you care about botanical lounge culture in Florida — "
            f"then come sip something creamy or fruity in person. [Read the source]({it['url']})"
        )
        lines.append("")

    lines += [
        "---",
        "",
        "**Local CTAs:** [Menu](https://tribalkavalounge.com/menu) · [New Here?](https://tribalkavalounge.com/new-here) · [Visit](https://tribalkavalounge.com/visit)",
        "",
        "**Responsible use:** Kratom products are for adults 21+ only. Valid ID required. "
        "Products are not intended to diagnose, treat, cure, or prevent any disease. "
        "Do not mix kava or kratom with alcohol or other substances. "
        "If you are pregnant, nursing, taking medications, or have health concerns, speak with a qualified professional.",
        "",
        "*Tribal Kava Lounge — 770 S Military Trail, Unit A1, West Palm Beach, FL 33415 · (561) 355-0561*",
        "",
    ]
    return "\n".join(lines)


def _llm_polish(markdown: str) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return markdown
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    system = (
        "You rewrite kava/kratom lounge blog digests. Rules: original words only; short summaries; "
        "attribute and link sources; never medical/health/benefit/effect claims; never dosing; "
        "never energy/pain/anxiety/sleep claims; kratom always 21+; flavor/culture/social lounge framing; "
        "keep responsible-use footer; keep internal links to tribalkavalounge.com. "
        "Humorous, human, not a wellness brochure. Return markdown only."
    )
    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": markdown},
        ],
        "temperature": 0.4,
    }
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": UA,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        payload = json.loads(resp.read().decode())
    return payload["choices"][0]["message"]["content"].strip()


def cmd_draft(use_llm: bool = False) -> int:
    _ensure_dirs()
    pool = _load_json(CANDIDATES_PATH, {"items": []}).get("items", [])
    if not pool:
        print("No candidates. Run: python3 run_daily.py fetch")
        return 1

    # Prefer not-yet-drafted URLs
    queue = _load_json(QUEUE_PATH, {"items": []})
    used = {u for item in queue.get("items", []) for u in item.get("source_urls", [])}
    fresh = [c for c in reversed(pool) if c["url"] not in used][:5]
    if not fresh:
        fresh = list(reversed(pool))[:3]
        print("[info] Reusing recent candidates (all URLs already queued once).")

    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    md = _template_draft(fresh, day)
    if use_llm:
        try:
            md = _llm_polish(md)
            print("[info] LLM polish applied.")
        except Exception as e:
            print(f"[warn] LLM polish failed, keeping template: {e}", file=sys.stderr)

    slug = f"digest-{day}"
    out = DRAFTS_DIR / f"{slug}.md"
    # Avoid overwrite
    n = 2
    while out.exists():
        out = DRAFTS_DIR / f"{slug}-{n}.md"
        n += 1
    out.write_text(md)

    queue_item = {
        "file": str(out.relative_to(ROOT)),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "drafted",
        "source_urls": [c["url"] for c in fresh],
        "compliance": None,
    }
    queue.setdefault("items", []).append(queue_item)
    _save_json(QUEUE_PATH, queue)
    print(f"Draft written: {out}")
    return 0


def cmd_check(file: str | None = None) -> int:
    _ensure_dirs()
    queue = _load_json(QUEUE_PATH, {"items": []})
    targets = []
    if file:
        targets = [Path(file)]
    else:
        targets = sorted(DRAFTS_DIR.glob("*.md"))

    if not targets:
        print("No drafts to check.")
        return 1

    exit_code = 0
    for path in targets:
        text = path.read_text()
        result = check_text(text, context="daily")
        rel = str(path.relative_to(ROOT)) if path.is_absolute() and ROOT in path.parents else str(path)
        # normalize rel
        try:
            rel = str(path.resolve().relative_to(ROOT))
        except Exception:
            rel = str(path)

        print(f"{rel}: {result['summary']} (score {result['score']})")
        for f in result["flags"]:
            print(f"  - [{f['severity']}] {f['rule']}: {f.get('match','')[:80]}")

        # Update queue
        found = False
        for item in queue.get("items", []):
            if item.get("file") == rel or item.get("file") == str(path):
                item["compliance"] = result
                item["status"] = "passed" if result["pass"] else "failed"
                item["checked_at"] = datetime.now(timezone.utc).isoformat()
                found = True
        if not found:
            queue.setdefault("items", []).append(
                {
                    "file": rel,
                    "status": "passed" if result["pass"] else "failed",
                    "compliance": result,
                    "checked_at": datetime.now(timezone.utc).isoformat(),
                    "source_urls": [],
                }
            )
        if not result["pass"]:
            exit_code = 2

    _save_json(QUEUE_PATH, queue)
    return exit_code


def cmd_status() -> int:
    _ensure_dirs()
    queue = _load_json(QUEUE_PATH, {"items": []})
    items = queue.get("items", [])
    if not items:
        print("Queue empty.")
        return 0
    for item in items[-20:]:
        print(f"{item.get('status','?'):10}  {item.get('file')}  sources={len(item.get('source_urls') or [])}")
    return 0


def cmd_approve(file: str) -> int:
    _ensure_dirs()
    queue = _load_json(QUEUE_PATH, {"items": []})
    rel = file
    path = Path(file)
    if path.exists():
        try:
            rel = str(path.resolve().relative_to(ROOT))
        except Exception:
            rel = file
    updated = False
    for item in queue.get("items", []):
        if item.get("file") == rel or item.get("file") == file:
            if item.get("status") == "failed":
                print("Refusing approve: last compliance check failed. Fix and re-check.")
                return 1
            item["status"] = "approved"
            item["approved_at"] = datetime.now(timezone.utc).isoformat()
            updated = True
    if not updated:
        print("File not in queue. Run check first.")
        return 1
    _save_json(QUEUE_PATH, queue)
    print(f"Approved: {rel}")
    print("Next: manually port into ../daily-kava.js and deploy. (No auto-publish by design.)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="The Daily Kava content engine")
    parser.add_argument("command", choices=["fetch", "draft", "check", "status", "approve", "run"])
    parser.add_argument("--llm", action="store_true", help="Use OpenAI-compatible polish when drafting")
    parser.add_argument("--file", help="Specific draft for check/approve")
    args = parser.parse_args()

    if args.command == "fetch":
        return cmd_fetch()
    if args.command == "draft":
        return cmd_draft(use_llm=args.llm)
    if args.command == "check":
        return cmd_check(file=args.file)
    if args.command == "status":
        return cmd_status()
    if args.command == "approve":
        if not args.file:
            print("--file required for approve")
            return 1
        return cmd_approve(args.file)
    if args.command == "run":
        rc = cmd_fetch()
        if rc != 0:
            return rc
        rc = cmd_draft(use_llm=args.llm)
        if rc != 0:
            return rc
        return cmd_check()
    return 1


if __name__ == "__main__":
    sys.exit(main())
