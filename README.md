# Edefy Pixel Perfect

TASK: Pixel-Accurate Recreation of Edefy Website

Reference website:

https://edefy.framer.website/

Your job is to recreate the reference website as accurately as technically possible.

This is NOT a redesign. Do NOT introduce your own design decisions.

The goal is to reproduce the website's:

Layout

Typography

Colors

Spacing

Responsive behavior

Navigation

Pages

Sections

Images

Icons

Animations

Scroll effects

Hover effects

Page transitions

Interactive elements

Buttons

Cards

Forms

Menus

Sticky/fixed elements

Loading behavior

Micro-interactions

Visual hierarchy

Overall user experience

1. FIRST: ANALYZE THE REFERENCE WEBSITE

Before writing significant code, thoroughly inspect:

https://edefy.framer.website/

Explore the entire website.

Do NOT only inspect the homepage.

Find every accessible page and route through:

Navbar links

Footer links

Buttons

Cards

CTAs

Internal links

Navigation menus

Mobile navigation

Any hidden/secondary pages

Create an internal inventory containing:

Pages

For every page identify:

URL/path

Page title

Sections

Components

Images

Text content

Buttons

Links

Animations

Scroll behavior

Responsive behavior

Components

Identify reusable components such as:

Navbar

Mobile menu

Hero

Section headers

Cards

Buttons

Testimonials

Feature sections

Image sections

CTA sections

Footer

Forms

Marquee/slider components

Modal/dialog components

Navigation elements

Do not duplicate components unnecessarily.

2. RECREATE THE VISUAL DESIGN

The implementation should visually match the reference as closely as possible.

Pay attention to:

Exact spacing

Container widths

Maximum widths

Section heights

Grid structure

Flex layouts

Border radius

Borders

Shadows

Backgrounds

Gradients

Typography

Font weights

Letter spacing

Line heights

Image cropping

Object positioning

Icon sizes

Button dimensions

Alignment

Vertical rhythm

Do not approximate obvious values when they can be inspected or measured.

Use CSS variables/design tokens where appropriate.

Example:

:root {
  --container-width: ...;
  --section-spacing: ...;
  --radius: ...;
  --primary: ...;
  --background: ...;
  --foreground: ...;
}


3. TYPOGRAPHY

Identify the fonts used by the reference website.

Reproduce:

Font family

Font weights

Font sizes

Line heights

Letter spacing

Text transforms

Create responsive typography.

Desktop, tablet and mobile typography must match the reference.

Do not use a random replacement font if the actual font can be identified.

4. IMAGES AND ASSETS

Inspect all publicly accessible assets used by the reference website.

Identify:

Hero images

Section images

Background images

Logos

Icons

SVGs

Illustrations

Videos

Decorative assets

Avatars

Product images

Textures

Background graphics

Where legally permitted, reproduce the same assets.

Preserve:

Aspect ratio

Resolution

Cropping

Object position

Placement

Border radius

Animation behavior

Do NOT replace important visual assets with generic placeholders if the actual authorized asset is available.

If an asset cannot legally or technically be reused, create a visually equivalent replacement instead.

Organize assets properly:

public/
  images/
  icons/
  videos/
  fonts/


Do not leave external Framer asset URLs scattered throughout components unless absolutely necessary.

5. ANIMATIONS — VERY IMPORTANT

The animations are a major part of the recreation.

Inspect the reference carefully and reproduce the animation behavior.

Look for:

Page-load animations

Fade in

Slide in

Scale

Blur

Stagger

Text reveal

Image reveal

Hero entrance

Scroll animations

Fade

Parallax

Scale

Translate

Sticky sections

Pinning

Horizontal scrolling

Image transformations

Text transformations

Section reveals

Hover animations

Button hover

Card hover

Image zoom

Cursor interaction

Text movement

Underline animation

Icon movement

Color transitions

Navigation animations

Navbar appearance

Mobile menu opening

Menu item stagger

Dropdown animation

Page transition

Continuous animations

Marquees

Infinite sliders

Floating elements

Rotations

Background movement

Reproduce animation timing and easing as closely as possible.

Use:

Framer Motion where appropriate

CSS transitions/keyframes for simple animations

Intersection Observer when necessary

requestAnimationFrame only when necessary

GSAP only if a complex animation genuinely requires it

Do not over-engineer simple animations.

6. SCROLL BEHAVIOR

Inspect the reference while scrolling slowly.

Determine:

What becomes sticky?

What moves?

What stays fixed?

Which elements animate into view?

Which sections overlap?

Are there parallax effects?

Are there pinned sections?

Are there horizontal scroll sections?

Are there scroll-triggered transformations?

Recreate these behaviors.

The page should feel like the original while scrolling, not just look similar when static.

7. RESPONSIVE DESIGN

Test and reproduce the reference at:

Desktop

1440px

1280px

1024px

Tablet

768px

834px

Mobile

390px

375px

360px

Do not simply shrink the desktop design.

Inspect how the reference changes between breakpoints.

Pay particular attention to:

Navbar

Mobile menu

Typography

Grid → stack behavior

Image ratios

Section spacing

Buttons

Cards

Horizontal overflow

Animation behavior

Footer

Touch interactions

8. NAVIGATION

Recreate the navigation exactly.

Include:

Desktop navbar

Mobile navbar

Dropdowns

Menu animations

Active states

Hover states

Logo behavior

Sticky behavior

Scroll behavior

Every navigation link should work.

No dead buttons.

No fake navigation.

9. ROUTING

Every discovered page must have its own route.

Do not put the entire website into one component.

Use a clean structure such as:

src/
  routes/
    index.tsx
    ...
  components/
    layout/
    navigation/
    sections/
    ui/
  lib/
  styles/


If the reference contains multiple pages, implement all of them.

Each page should be directly accessible through its URL.

10. INTERACTIONS

Every visible interaction should work.

Examples:

Buttons

Links

Navigation

Mobile menu

Dropdowns

Sliders

Carousels

Tabs

Accordions

Forms

Modals

Hover effects

Scroll interactions

Do not create visual-only buttons.

If the original interaction cannot be reproduced exactly, create the closest functional equivalent.

11. CODE QUALITY

The final implementation must be production-quality.

Requirements:

TypeScript

Reusable React components

No unnecessary duplication

Proper semantic HTML

Accessible buttons/links

Keyboard navigation

Responsive CSS

Clean component hierarchy

Meaningful names

No huge monolithic component

No unnecessary dependencies

Avoid:

<div onClick={...}>


when a proper button/link should be used.

Avoid hardcoding the same values throughout the application.

12. PERFORMANCE

The site should remain smooth despite the animations.

Implement:

Lazy loading

Proper image sizing

Optimized images

Efficient animation techniques

Avoid unnecessary re-renders

Avoid expensive scroll listeners

Use transform/opacity for animations where possible

Respect prefers-reduced-motion

Animations should not cause visible jank.

13. SEO

For every page implement:

Page title

Meta description

Proper heading hierarchy

Open Graph metadata where appropriate

Semantic HTML

Image alt text

Canonical URLs where appropriate

14. ACCESSIBILITY

Ensure:

Keyboard navigation

Visible focus states

Proper buttons

Proper links

Image alt text

Form labels

Sufficient contrast

Reduced-motion support

ARIA only when actually necessary

15. EXACT CONTENT

Do not paraphrase visible website copy.

Reproduce the reference content accurately where you are authorized to do so.

Preserve:

Headings

Paragraphs

Button labels

Navigation labels

Footer text

Card text

CTA text

Do not randomly invent replacement content.

16. DO NOT REDESIGN

This is extremely important.

DO NOT:

Change the color palette

Add dark mode

Change the typography

Change layouts

Add unnecessary gradients

Add random 3D elements

Add unnecessary animations

Change button styles

Change spacing

Modernize the UI

"Improve" the design according to your own preference

The objective is faithful recreation.

17. IMPLEMENTATION PROCESS

Follow this workflow:

PHASE 1 — RESEARCH

Inspect the entire reference website.

Create a page/component/asset/animation inventory.

Do not start blindly coding.

PHASE 2 — FOUNDATION

Set up:

Project structure

Fonts

Global CSS

Colors

Typography

Responsive breakpoints

Container system

Shared components

PHASE 3 — GLOBAL COMPONENTS

Build:

Navbar

Mobile navigation

Footer

Buttons

Typography components

Shared cards

Shared layout components

PHASE 4 — PAGES

Implement every discovered page one by one.

For every page:

Match layout

Match content

Match assets

Match responsive behavior

Match animations

Match interactions

PHASE 5 — ANIMATIONS

After the static layouts are accurate, reproduce:

Entrance animations

Scroll animations

Hover effects

Page transitions

Marquees

Parallax

Sticky effects

Mobile interactions

PHASE 6 — QA

Compare the implementation against the reference.

Check:

Desktop

Tablet

Mobile

Every route

Every animation

Every interaction

Navigation

Images

Typography

Spacing

Overflow

Console errors

18. VISUAL COMPARISON

Use screenshots during development.

For each page:

Open reference

Capture reference at the same viewport

Capture implementation

Compare side-by-side

Identify differences

Fix differences

Repeat

Pay particular attention to:

Header height

Hero positioning

Font sizes

Section spacing

Image dimensions

Container width

Button position

Card dimensions

Footer

Animation timing

Do not consider a page complete simply because it "looks similar."

19. FINAL ACCEPTANCE CRITERIA

The project is complete only when:

Every accessible page has been recreated

Every major section exists

Navigation works

Responsive layouts work

Images/assets are correctly handled

Animations are implemented

Hover states are implemented

Scroll interactions are implemented

Mobile navigation works

Forms/interactions work

No obvious visual mismatches remain

No console errors remain

No broken routes remain

No horizontal overflow exists on mobile

Performance remains smooth

IMPORTANT

Do not stop after creating the homepage.

Do not ask me to manually describe every section if the information can be obtained by inspecting the reference website.

First inspect the reference thoroughly, then build.

If you discover additional pages, components, interactions, or animations during implementation, add them.

Before declaring completion, perform a final full-site audit against:

https://edefy.framer.website/

The final result should feel like the same website, not merely a website inspired by it.

## Development

Prefer working locally? You need Node.js and npm.

```sh
npm i
npm run dev
```
