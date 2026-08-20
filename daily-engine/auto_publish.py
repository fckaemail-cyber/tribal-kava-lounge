#!/usr/bin/env python3
"""
Auto-publish approved drafts to daily-kava.js and trigger Netlify deploy.
Runs after daily-engine creates and approves drafts.
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DAILY_KAVA_JS = ROOT / "daily-kava.js"
QUEUE_PATH = ROOT / "daily-engine" / "state" / "queue.json"
DRAFTS_DIR = ROOT / "daily-engine" / "drafts"


def load_queue():
    if not QUEUE_PATH.exists():
        return {"items": []}
    return json.loads(QUEUE_PATH.read_text())


def save_queue(queue):
    QUEUE_PATH.write_text(json.dumps(queue, indent=2, ensure_ascii=False) + "\n")


def markdown_to_html(md_text):
    """Convert markdown to HTML (basic conversion for blog posts)."""
    html = md_text
    
    # Convert headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Convert bold
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # Convert italic
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    
    # Convert links
    html = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2">\1</a>', html)
    
    # Convert lists
    html = re.sub(r'^\* (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'(<li>.*</li>\n?)+', lambda m: '<ul>\n' + m.group(0) + '</ul>\n', html, flags=re.DOTALL)
    
    # Convert paragraphs (lines that don't start with < or are empty)
    lines = html.split('\n')
    result = []
    in_list = False
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            result.append('')
            continue
        if stripped.startswith('<'):
            result.append(line)
            in_list = stripped.startswith('<ul>') or stripped.startswith('<li>')
        else:
            if not in_list:
                result.append(f'<p>{line}</p>')
            else:
                result.append(line)
    
    return '\n'.join(result)


def extract_frontmatter(draft_path):
    """Extract title, dek, category, tags from draft markdown."""
    content = draft_path.read_text()
    
    # Try to extract title from first H1
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Untitled"
    
    # Try to extract category from metadata or default to "Industry"
    category = "Industry"
    if "Category:" in content:
        cat_match = re.search(r'Category:\s*(\w+)', content)
        if cat_match:
            category = cat_match.group(1)
    
    # Generate dek from first paragraph
    paragraphs = re.findall(r'<p>(.+?)</p>', markdown_to_html(content), re.DOTALL)
    dek = paragraphs[0][:150] + "..." if paragraphs else "Latest from The Daily Kava"
    
    # Generate slug from filename
    slug = draft_path.stem
    if slug.startswith("digest-"):
        slug = slug.replace("digest-", "daily-digest-")
    
    return {
        "title": title,
        "dek": dek,
        "category": category,
        "slug": slug,
        "tags": [category.lower()],
        "readMin": 5
    }


def create_post_object(draft_path):
    """Create a daily-kava.js post object from a draft."""
    meta = extract_frontmatter(draft_path)
    content = draft_path.read_text()
    html_body = markdown_to_html(content)
    
    # Clean up the HTML for JS template literal
    html_body = html_body.replace('`', '\\`').replace('${', '\\${')
    
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    post = f"""  {{
    slug: '{meta['slug']}',
    title: '{meta['title'].replace("'", "\\'")}',
    dek: '{meta['dek'].replace("'", "\\'")}',
    date: '{date}',
    category: '{meta['category']}',
    readMin: {meta['readMin']},
    tags: {json.dumps(meta['tags'])},
    body: `
      {html_body}
    `
  }}"""
    
    return post


def add_to_daily_kava(post_object):
    """Add a post object to daily-kava.js."""
    if not DAILY_KAVA_JS.exists():
        print(f"Error: {DAILY_KAVA_JS} not found")
        return False
    
    content = DAILY_KAVA_JS.read_text()
    
    # Find the closing bracket of the array
    # Look for the pattern: ];\n\nfunction getDailyKavaPost
    match = re.search(r'(\n\];\n\nfunction getDailyKavaPost)', content)
    if not match:
        print("Error: Could not find insertion point in daily-kava.js")
        return False
    
    # Insert the new post before the closing bracket
    insert_pos = match.start()
    new_content = content[:insert_pos] + ",\n" + post_object + content[insert_pos:]
    
    DAILY_KAVA_JS.write_text(new_content)
    return True


def mark_as_published(queue_item):
    """Mark a queue item as published."""
    queue_item['status'] = 'published'
    queue_item['published_at'] = datetime.now(timezone.utc).isoformat()


def main():
    queue = load_queue()
    items = queue.get("items", [])
    
    # Find approved but not published items
    to_publish = [item for item in items if item.get('status') == 'approved' and not item.get('published_at')]
    
    if not to_publish:
        print("No approved drafts to publish.")
        return 0
    
    published_count = 0
    
    for item in to_publish:
        draft_file = ROOT / "daily-engine" / item['file']
        if not draft_file.exists():
            print(f"Warning: Draft file not found: {draft_file}")
            continue
        
        print(f"Publishing: {draft_file.name}")
        
        # Create post object
        post_object = create_post_object(draft_file)
        
        # Add to daily-kava.js
        if add_to_daily_kava(post_object):
            mark_as_published(item)
            published_count += 1
            print(f"  ✓ Added to daily-kava.js")
        else:
            print(f"  ✗ Failed to add to daily-kava.js")
    
    # Save updated queue
    save_queue(queue)
    
    print(f"\nPublished {published_count} post(s).")
    print("Next: Run 'netlify deploy --prod' to push changes live.")
    
    return 0 if published_count > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
