#!/usr/bin/env python3
"""
v0 Compliance API — deterministic rules from Master Build Document §3.

Returns: { "pass": bool, "score": 0-100, "flags": [...], "required_additions": [...] }
No medical advice. No network. Safe to run offline on every draft.
"""

from __future__ import annotations

import re
from typing import Any

# Standard disclaimer language is ALLOWED (strip before claim scan)
ALLOWED_DISCLAIMER_PATTERNS = [
    r"not intended to diagnose,? treat,? cure,? or prevent any disease",
    r"products? are not intended to diagnose",
    r"do not mix kava or kratom with alcohol",
    r"speak with a qualified professional",
    r"valid (government-issued )?id required",
    r"kratom products are for adults 21\+",
]

# §3.1-style prohibited patterns (case-insensitive) — marketing claims only
PROHIBITED = [
    (r"\breliev(?:e|es|ing)\s+pain\b", "pain-relief claim"),
    (r"\bpain\s+relief\b", "pain-relief claim"),
    (r"\b(treats?|treating)\s+(anxiety|pain|depression|addiction|withdrawal|insomnia|stress)\b", "treatment claim"),
    (r"\btreatment for\b", "treatment claim"),
    (r"\b(cures?|curing)\s+\w+", "cure claim"),
    (r"\bprevents?\s+(disease|illness|addiction|anxiety|pain)\b", "prevention claim"),
    (r"\bopioid\s+withdrawal\b", "opioid/withdrawal claim"),
    (r"\b(helps? with|for) addiction\b", "addiction framing"),
    (r"\b(cures?|treats?) addiction\b", "addiction framing"),
    (r"\b(anxiety|depression|insomnia)\s+(relief|remedy|medicine)\b", "mental-health condition claim"),
    (r"\bhelps?\s+(you\s+)?(with\s+)?(sleep|anxiety|depression|stress)\b", "sleep/mood claim"),
    (r"\bmelts?\s+stress\b", "stress/effect claim"),
    (r"\b(sedative|euphoria|euphoric)\b", "effect hype"),
    (r"\b(herbal )?supplement\b", "supplement framing"),
    (r"\bnootropic\b", "supplement framing"),
    (r"\b(energy\s+boost|boosts?\s+energy|gives?\s+energy)\b", "energy claim"),
    (r"\b(workout|productivity)\s+(boost|aid|enhancer)?\b", "performance claim"),
    (r"\bsafe\s+for\s+daily\s+use\b", "daily-use safety claim"),
    (r"\brisk[-\s]?free\b", "risk-free claim"),
    (r"\bguaranteed?\s+effects?\b", "guaranteed effects"),
    (r"\b(recommended dosing|dosage instructions|mg\s+per\s+day)\b", "dosing advice"),
    (r"\b(strong|powerful|potent)\b.{0,30}\b(extract|shot|kratom)\b", "extract/shot intensity hype"),
    (r"\b(extract|shot)s?\b.{0,30}\b(strong|powerful|potent|energy)\b", "extract/shot intensity hype"),
]



# Daily editorial gate — separate from product-claim compliance.
# These topics are disallowed in Daily stories even when reported neutrally.
EDITORIAL_REJECT_PATTERNS = [
    (r"\b(?:7[\s-]?oh|7-hydroxymitragynine)\b", "7-OH coverage"),
    (r"\b(?:regulation|regulatory|legislation|legislative|bill|law|laws|legal|policy|political|lobby(?:ing|ist)?)\b", "legal or political coverage"),
    (r"\b(?:fda|dea|ban(?:ned|s)?|crackdown|fine|penalt(?:y|ies)|enforcement|court|lawsuit|recall|warning)\b", "regulatory or enforcement coverage"),
    (r"\b(?:addiction|addicted|withdrawal|overdose|death|died|fatal|hospitali[sz]|poison|contaminat(?:ed|ion)|danger(?:ous)?|risk|scare|harm)\b", "negative or scare coverage"),
    (r"\b(?:kratom|mitragynine)\b", "kratom news is outside the Daily editorial scope"),
    (r"\b(?:anxiety|depression|pain|sleep|insomnia|health benefit|medical)\b", "health or medical framing"),
]

def check_candidate(item: dict[str, Any], *, category: str = "") -> dict[str, Any]:
    """Reject Daily candidates that conflict with Tribal's positive editorial scope."""
    text = " ".join(str(item.get(k, "")) for k in ("title", "summary", "source"))
    flags = []
    for pattern, label in EDITORIAL_REJECT_PATTERNS:
        match = re.search(pattern, text, flags=re.I)
        if match:
            flags.append({"severity": "error", "rule": "editorial-" + label.lower().replace(" ", "-"), "match": match.group(0)})
    if category.lower() in {"regulation", "legal", "politics"}:
        flags.append({"severity": "error", "rule": "editorial-disallowed-category", "match": category})
    return {
        "pass": not flags,
        "flags": flags,
        "summary": "PASS" if not flags else "REJECTED: " + flags[0]["rule"],
    }


def _strip_allowed(text: str) -> str:
    out = text
    for pat in ALLOWED_DISCLAIMER_PATTERNS:
        out = re.sub(pat, " ", out, flags=re.I)
    return out

REQUIRED_PHRASES_IF_KRATOM = [
    ("21+", "Kratom content should mention 21+"),
]

RESPONSIBLE_USE_HINTS = [
    "not intended to diagnose",
    "do not mix",
    "valid id",
    "qualified professional",
]


def check_text(text: str, *, context: str = "daily") -> dict[str, Any]:
    flags: list[dict[str, str]] = []
    lower = text.lower()
    scan = _strip_allowed(text)

    if context == "daily":
        # Story body only: the responsible-use footer may mention regulated products
        # and is not editorial content.
        editorial_body = text.split("\n---", 1)[0]
        editorial = check_candidate({"title": editorial_body, "summary": ""})
        flags.extend(editorial["flags"])

    for pattern, label in PROHIBITED:
        for m in re.finditer(pattern, scan, flags=re.I):
            flags.append(
                {
                    "severity": "error",
                    "rule": label,
                    "match": m.group(0),
                    "span": f"{m.start()}-{m.end()}",
                }
            )

    required_additions: list[str] = []
    mentions_kratom = bool(re.search(r"\bkratom\b", text, re.I))
    if mentions_kratom:
        for needle, msg in REQUIRED_PHRASES_IF_KRATOM:
            if needle.lower() not in lower:
                required_additions.append(msg)
                flags.append({"severity": "error", "rule": "missing-21-plus", "match": msg})

        # Soft warnings for missing responsible-use language on longer posts
        if len(text) > 400:
            if not any(h in lower for h in RESPONSIBLE_USE_HINTS):
                flags.append(
                    {
                        "severity": "warning",
                        "rule": "missing-responsible-use-language",
                        "match": "Consider footer-style responsible-use lines on longer kratom posts",
                    }
                )

    # Copyright: huge pasted blocks (heuristic)
    if len(text) > 6000:
        flags.append(
            {
                "severity": "warning",
                "rule": "length",
                "match": "Very long draft — ensure this is original summary, not republished article text",
            }
        )

    errors = [f for f in flags if f["severity"] == "error"]
    warnings = [f for f in flags if f["severity"] == "warning"]
    score = max(0, 100 - 25 * len(errors) - 5 * len(warnings))

    return {
        "pass": len(errors) == 0,
        "score": score,
        "flags": flags,
        "required_additions": required_additions,
        "context": context,
        "summary": "PASS" if not errors else f"FAIL ({len(errors)} error(s))",
    }


if __name__ == "__main__":
    import json
    import sys

    sample = sys.stdin.read() if not sys.argv[1:] else open(sys.argv[1]).read()
    print(json.dumps(check_text(sample), indent=2))
