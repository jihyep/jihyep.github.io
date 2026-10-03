"""Dependency-free validation for this static portfolio. Run from any directory."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.refs, self.images = path, [], [], []
        self.feed(path.read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for name in ("href", "src"):
            if name in attrs:
                self.refs.append(attrs[name])
        if tag == "img":
            self.images.append(attrs)

pages = {p.resolve(): Page(p) for p in ROOT.rglob("*.html")}
for path, page in pages.items():
    assert len(page.ids) == len(set(page.ids)), f"Duplicate IDs: {path}"
    assert all("alt" in i and "width" in i and "height" in i for i in page.images), path
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        if target.is_dir():
            target /= "index.html"
        assert target.is_relative_to(ROOT), f"Path outside site: {ref}"
        assert target.is_file(), f"Missing resource: {path}: {ref}"
        if url.fragment and target in pages:
            assert url.fragment in pages[target].ids, f"Missing anchor: {ref}"

detail = (ROOT / "awards/meit/index.html").read_text(encoding="utf-8")
home = (ROOT / "index.html").read_text(encoding="utf-8")
assert home.count('href="awards/meit/"') == 1
assert detail.count('<math ') == 5
assert detail.count('<figure class="code-example">') == 3
for content in (home, detail):
    assert "Silver Award" in content and "$900 Prize" in content
    assert not re.search(r"3rd Place|₩900,000|900 USD|X-Amz-|prod-files-secure", content)
assert 'rel="canonical"' in detail and 'property="og:image"' in detail
assert 'name="robots" content="noindex,nofollow"' in detail
print(f"PASS: {len(pages)} HTML pages; local resources, anchors, image attributes, math/code counts, award copy and metadata.")

assert not (ROOT / "projects/meit").exists()
for deleted in ("communication", "challenges", "results", "retrospective"):
    assert f'id="{deleted}"' not in detail
assert detail.count('class="case-section"') == 12
assert "2026 5th MEIT Interdisciplinary Project Competition" in detail
assert "The microphone frontend was ultimately replaced." in detail
assert "AIInputBuffer.swift" not in detail
assert 'class="demo-toggle"' not in detail
assert "https://github.com/MEIT-competition/meit-ee" in detail
assert "https://github.com/MEIT-competition/meit-ai" not in detail
assert not re.search(r"\b[0-9a-f]{7,40}\b", re.sub(r"<[^>]*>", "", detail))
print("PASS: Awards route, 12 sections, deletions, public source links and no visible commit hashes.")
