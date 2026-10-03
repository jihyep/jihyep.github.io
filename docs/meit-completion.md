# MEIT portfolio revision — 2026-10-02

## Changed

- Preserved the existing typography, colors, dividers and timeline layout.
- Awards: The 5th MEIT of Sookmyung; Sookmyung Women's University ICT CONVERGENCE RESEARCH INSTITUTE; Silver Award - $900 Prize · Team Project.
- Used the existing VIPL lab-heading, lab-link and link-arrow SVG/styles for Awards and both Source links, including hover behavior and no underline.
- Revised Overview around WHAT / WHERE / HOW; compacted equations, hardware photos and app media.
- Recognition uses the English competition name requested in the latest message: 2026 5th MEIT Interdisciplinary Project Competition.
- Renumbered the remaining 12 sections consecutively. Actuation retains the individually authored sequencer and hardware bring-up.

## Moved

`/projects/meit/` → `/awards/meit/`. Removed MEIT from Research / Projects; updated navigation, canonical and Open Graph URLs. Both return links lead to About / Awards.

## Deleted

HTTP and BLE; Engineering Challenges; Results; Retrospective. Removed the Korean subtitle, requested disclaimer paragraphs, AIInputBuffer excerpt, final haptic profile table, exposed authors/commits/line references, and surplus Source entries.

## Added

The attached final-system photo, a two-image iOS carousel with arrows/keyboard/swipe and GIF autoplay, Circuit Design & Fabrication contribution, and verified-public Embedded / Electronics source link. Hero photos use contain with bounded height; iterations use image/text columns on desktop.

## Verified

The project is static HTML/CSS/JS with no build step.

- `python tools/check_site.py`: PASS for resources, anchors, metadata, required copy, 12 sections, removed route and no visible commit hashes.
- `node --check script.js` and `node --check awards/meit/meit.js`: PASS.
- Local HTTP + Headless Edge at 1440, 768, 390 and 320px: no document overflow, broken images, browser errors or failed resources.
- Exact VIPL SVG, default and hover styles compared; no underline on Award/Source arrows.
- Award routing, return links, history, menu keyboard behavior, 14 internal links, smooth scroll and reduced-motion behavior: PASS.
- Carousel buttons, keyboard, mobile touch swipe, resize alignment and GIF frame advancement without a Play action: PASS.
- Hero/app/iteration layouts and compact MathML checked in browser screenshots.
- Home and Links screenshots remain pixel-identical to the previous checkout on desktop and mobile.

No commit, push or deployment was performed.
