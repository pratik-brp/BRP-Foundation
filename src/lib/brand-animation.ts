// Build-up animation for the layered B.R.P. Foundation logo SVG, shared by the
// full-screen preloader and the in-page tree mark. It only reveals the SVG's existing
// layers (see docs/brand-preloader.md); layers that are missing are simply skipped.

const EASE = "cubic-bezier(.22, 1, .36, 1)";

// Timeline as fractions of `duration`: [start, length].
const TIMELINE = {
  ring: [0, 0.32],
  trunk: [0.16, 0.26],
  branches: [0.3, 0.2],
  head: [0.42, 0.12],
  leaves: [0.44, 0.4], // stagger window; each leaf also gets `leaf` below
  leaf: [0, 0.16],
  ground: [0.52, 0.2],
  accents: [0.6, 0.16],
  text: [0.7, 0.26],
} as const;

function play(el: Element, name: string, start: number, length: number, duration: number) {
  (el as SVGElement).style.animation =
    `${name} ${Math.round(length * duration)}ms ${EASE} ${Math.round(start * duration)}ms both`;
}

// Moves an element into a fresh <g> so it can be scaled around its visual centre
// without modifying the element itself.
function wrap(el: Element): SVGGElement {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "bp-wrap");
  el.replaceWith(g);
  g.appendChild(el);
  return g;
}

export function choreograph(svg: SVGSVGElement, duration: number, expectedLeaves: number) {
  const $ = (id: string) => svg.querySelector(`#${id}`);

  // Ring: draw stroked paths. A ring that is an image or filled shape is revealed by a
  // circular mask whose stroke sweeps round from the top, so it still "draws" itself.
  const ring = $("brp-ring");
  if (
    ring &&
    !ring.matches("path, circle, ellipse") &&
    !ring.querySelector("path, circle, ellipse")
  ) {
    const NS = "http://www.w3.org/2000/svg";
    const b = (ring as SVGGraphicsElement).getBBox();
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const r = Math.max(b.width, b.height) / 2;
    const mask = document.createElementNS(NS, "mask");
    mask.id = "bp-ring-sweep";
    // Explicit region: the userSpaceOnUse default is relative to the origin, not the viewBox
    for (const [k, v] of Object.entries({
      maskUnits: "userSpaceOnUse",
      x: b.x - 10,
      y: b.y - 10,
      width: b.width + 20,
      height: b.height + 20,
    })) {
      mask.setAttribute(k, String(v));
    }
    const sweep = document.createElementNS(NS, "circle");
    for (const [k, v] of Object.entries({
      cx,
      cy,
      r: r * 0.93,
      fill: "none",
      stroke: "#fff",
      "stroke-width": r * 0.3,
      pathLength: 1,
      transform: `rotate(-90 ${cx} ${cy})`,
    })) {
      sweep.setAttribute(k, String(v));
    }
    sweep.style.strokeDasharray = "1";
    sweep.style.setProperty("--bp-len", "1");
    mask.appendChild(sweep);
    svg.insertBefore(mask, svg.firstChild);
    ring.setAttribute("mask", "url(#bp-ring-sweep)");
    play(sweep, "bp-draw", TIMELINE.ring[0], TIMELINE.ring[1], duration);
  }
  const ringParts = ring?.matches("path, circle, ellipse")
    ? [ring]
    : Array.from(ring?.querySelectorAll("path, circle, ellipse") ?? []);
  ringParts.forEach((part) => {
    const shape = part as SVGGeometryElement;
    if (getComputedStyle(shape).stroke !== "none" && shape.getTotalLength) {
      const len = shape.getTotalLength();
      shape.style.strokeDasharray = `${len}`;
      shape.style.setProperty("--bp-len", `${len}`);
      play(shape, "bp-draw", TIMELINE.ring[0], TIMELINE.ring[1], duration);
    } else {
      play(shape, "bp-fade", TIMELINE.ring[0], TIMELINE.ring[1], duration);
    }
  });

  const trunk = $("brp-trunk");
  if (trunk) play(trunk, "bp-grow-up", TIMELINE.trunk[0], TIMELINE.trunk[1], duration);
  const branches = $("brp-branches");
  if (branches) play(branches, "bp-grow-up", TIMELINE.branches[0], TIMELINE.branches[1], duration);
  const head = $("brp-head");
  if (head) play(wrap(head), "bp-pop", TIMELINE.head[0], TIMELINE.head[1], duration);

  // Leaves: every direct child of #brp-leaves is one existing leaf. They are revealed in
  // place (fade + slight scale around their own centre), nearest the trunk top first.
  // The wrapper is animated rather than the leaf, so a leaf's own transform attribute
  // (its exported rotation/position) is never reinterpreted.
  const leafGroup = $("brp-leaves");
  const leaves = Array.from(leafGroup?.children ?? []).map(wrap);
  if (leaves.length !== expectedLeaves) {
    console.warn(
      `[BrandPreloader] #brp-leaves has ${leaves.length} leaves; the official logo has ${expectedLeaves}.`,
    );
  }
  const canopy = (trunk as SVGGraphicsElement | null)?.getBBox();
  const originX = canopy ? canopy.x + canopy.width / 2 : 0;
  const originY = canopy ? canopy.y : 0;
  const ordered = leaves
    .map((leaf) => {
      const b = leaf.getBBox();
      return { leaf, dist: Math.hypot(b.x + b.width / 2 - originX, b.y + b.height / 2 - originY) };
    })
    .sort((a, b) => a.dist - b.dist);
  const [winStart, winLength] = TIMELINE.leaves;
  const [, leafLength] = TIMELINE.leaf;
  const step = ordered.length > 1 ? (winLength - leafLength) / (ordered.length - 1) : 0;
  ordered.forEach(({ leaf }, i) =>
    play(leaf, "bp-leaf", winStart + i * step, leafLength, duration),
  );

  const ground = $("brp-ground");
  if (ground) play(ground, "bp-spread", TIMELINE.ground[0], TIMELINE.ground[1], duration);
  const accents = $("brp-accents");
  if (accents) play(accents, "bp-fade", TIMELINE.accents[0], TIMELINE.accents[1], duration);

  // Text: stagger its letters if they are separate elements, otherwise fade it as one.
  const text = $("brp-text");
  const letters = Array.from(text?.children ?? []);
  if (letters.length > 1) {
    const [start, length] = TIMELINE.text;
    const each = length * 0.5;
    const gap = (length - each) / (letters.length - 1);
    letters.forEach((letter, i) => play(letter, "bp-fade", start + i * gap, each, duration));
  } else if (text) {
    play(text, "bp-fade", TIMELINE.text[0], TIMELINE.text[1], duration);
  }
}
