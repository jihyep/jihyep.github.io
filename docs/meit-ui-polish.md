# UI refinement — October 3, 2026

- Reused the favicon rabbit as a 32px header image for About, Research, Links and the award detail page; retained the Home title.
- Implementation labels use an intrinsic-width column and 13px nonwrapping text; table headers also stay on one line.
- Awards detail link adds a 10px `more` label inheriting the arrow color and hover state.
- Added a built-in image-generation composition of the supplied belt prototype and iOS screen with the supplied Apple photograph as the style reference. The original photographs remain in the three-image hero carousel.
- Hero image viewport: 420px maximum width, 300px maximum height on desktop; 340px / 250px on mobile. Images retain their intrinsic proportions with transparent CSS backgrounds.
- Hardware photo: 360px desktop / 300px mobile width. Recognition photo: 240px desktop / 210px mobile width. No added gray side panels or image cropping.
- Both carousels share the same implementation but keep separate state; arrows, keyboard navigation, mobile swipe, wraparound and resize alignment work independently. The iOS GIF still autoplays.
- Repaired the existing Back to top link after its former heading had been removed; preserved the current page copy.

Validation: static resource/anchor check and JS syntax passed. Headless Edge at 1440, 900, 768, 390 and 320px passed for label text rows, image aspect ratios, transparent backgrounds, compact dimensions, header icons, independent carousel controls, touch swipe, GIF autoplay and internal navigation. No horizontal document overflow, missing images, console errors or failed requests. The Home screenshot is unchanged.

Image generation prompt and references: `product-composition-prompt.md`.
No commit, push or deployment.
