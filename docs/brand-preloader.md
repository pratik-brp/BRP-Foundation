# Brand preloader: layered logo SVG spec

The site's preloader (`src/components/BrandPreloader.tsx`) assembles the official
B.R.P. Foundation logo piece by piece. It animates **only** an SVG exported from the
original logo artwork. It never traces or redraws anything. Until that file exists at
`public/brand/brp-logo-layered.svg`, the preloader dismisses itself immediately.

## Current interim file

`public/brand/brp-logo-layered.svg` currently holds an **interim** version generated from
`public/brp-logo.jpg` by pixel segmentation. Every layer (ring, trunk, head, the 24
leaves, ground, gold accents, and each letter) is made of the logo's own unaltered
pixels, placed at their original coordinates as `<image>` elements. Nothing was traced
or redrawn: recombined, the layers match the JPG to within 9/255 per pixel. Because it's
still a 512px raster, it looks slightly soft on large or high-DPI screens. Replace the
file with the vector export described below; no code changes are needed.

## Why the current files can't be vectorised

The only logo files in the project are rasters: `public/brp-logo.jpg` (512×512) and
`public/brp-logo.png` (346×346). In the 512px JPG, each leaf is roughly 13×22 pixels,
and the lettering is about 10×18 pixels per capital. At that size, leaf tips, curvature,
the light leaf vein and the typeface can't be recovered exactly, so any trace would be
an approximation.

## What is needed from the designer

Any one of these, in order of preference:

1. **The original vector file**: `.ai`, `.eps`, `.pdf` (vector) or `.svg` from whoever
   made the logo.
2. If only a raster exists: a **PNG of at least 3000×3000 px** with a transparent
   background, plus the name of the typeface used for "B.R.P. FOUNDATION". This allows
   a manual trace, but exported vector artwork is still strongly preferred.

## Export requirements (Illustrator / Figma / Inkscape)

Export a single SVG with a `viewBox`. Keep the artwork exactly as designed, and only
**group and name** the layers so the ids come out as below:

| id | Contents | Animation |
|---|---|---|
| `brp-ring` | Outer circle. Export it as a **stroke** (not "outline stroke") so it can draw on. | Draws around the circle |
| `brp-trunk` | Trunk + figure body | Grows up from the bottom |
| `brp-branches` | *(optional)* Branches, if they are separate from the trunk | Grows up after the trunk |
| `brp-head` | *(optional)* The figure's head circle | Fades and scales in |
| `brp-leaves` | Group whose **direct children are the 24 leaves, one element (or sub-group) per leaf**. Name them `leaf-01` to `leaf-24` if you like. The order doesn't matter. | Each leaf fades and scales in, in place, one after another |
| `brp-ground` | Gold ground curve under the tree | Spreads out from the centre |
| `brp-accents` | *(optional)* The two gold dots and the thin gold arcs inside the ring | Fades in |
| `brp-text` | "B.R.P. FOUNDATION". **Outline the text** so no font is needed. Ideally one path per letter or dot, as direct children, so the letters can appear in sequence. | Letters fade in one by one |

The layers marked *(optional)* can be left out. The other layers must exist, or the
preloader skips itself.

Notes:
- Keep each leaf's own transform exactly as exported. The preloader wraps each leaf in
  its own group and animates that group, so leaves never move, rotate or change shape.
- Don't merge leaves into one compound path. That makes individual reveals impossible,
  and the preloader logs a warning if it doesn't find 24 leaves.
- Save the file as `public/brand/brp-logo-layered.svg`. SVGO is fine, but keep ids
  (`cleanupIds: false`).

## Leaf inventory (from `public/brp-logo.jpg`, 512×512 space)

Measured from the pixels, not drawn. There are **24 leaves**, numbered top to bottom.
See `docs/brp-logo-leaf-map.png` for the numbered overlay. Use this list to check that
the exported SVG has every leaf, and nothing extra.

| # | centre x | centre y | angle° | # | centre x | centre y | angle° |
|---|---|---|---|---|---|---|---|
| 1 | 252.4 | 163.6 | 77 | 13 | 273.5 | 226.7 | 89 |
| 2 | 284.1 | 170.1 | -70 | 14 | 298.2 | 229.2 | -49 |
| 3 | 222.8 | 174.7 | 71 | 15 | 210.7 | 233.3 | 47 |
| 4 | 267.0 | 192.2 | -84 | 16 | 316.4 | 246.6 | -35 |
| 5 | 312.8 | 192.8 | -59 | 17 | 344.9 | 247.6 | -19 |
| 6 | 241.2 | 194.4 | 81 | 18 | 167.6 | 254.5 | 8 |
| 7 | 199.3 | 198.3 | 55 | 19 | 199.3 | 254.8 | 42 |
| 8 | 288.9 | 201.5 | -72 | 20 | 225.5 | 262.6 | 56 |
| 9 | 226.9 | 217.1 | 63 | 21 | 299.0 | 268.0 | -20 |
| 10 | 331.7 | 217.1 | -37 | 22 | 335.6 | 269.6 | 10 |
| 11 | 252.7 | 221.9 | -85 | 23 | 180.9 | 281.5 | -20 |
| 12 | 179.9 | 226.7 | 33 | 24 | 322.0 | 287.8 | 32 |

Angles are each leaf's long-axis orientation (image y axis points down).

## Checking the export

1. Put the file at `public/brand/brp-logo-layered.svg` and load the site.
2. Open the browser console. Any problem is reported as `[BrandPreloader] ...`: missing
   layers skip the preloader, and a leaf count other than 24 is logged.
3. Compare the final frame with the original logo. It should be identical, because the
   preloader only animates the file's own shapes.

## Component options

```tsx
<BrandPreloader
  src="/brand/brp-logo-layered.svg" // layered SVG
  duration={3200}                    // build-up length in ms (all steps scale with it)
  hold={500}                         // finished logo shown before the fade
  exit={600}                         // fade into the site
  expectedLeaves={24}
  onComplete={() => {}}
/>
```

It's mounted once in `src/routes/__root.tsx` (`RootShell`), so it plays on each full page
load and never on in-app navigation. It is skipped for visitors who have turned on
reduced motion in their system settings, or who have JavaScript off. If the SVG takes
longer than 2.5s to arrive, the preloader gives up. A CSS timer also removes the overlay
if the scripts never run.
