/**
 * Farm layouts: where each of the four growing units sits, and what's inside it, for
 * every farm type the demo can show. The sim and the 3D scene both read these, so a
 * crate, a drone and a camera all agree on where "Container 3" is.
 *
 * Every unit's long side runs along x, so the harvest drone always sweeps from +x to -x.
 */

export const DEMO_TYPES = ["tower", "container", "greenhouse", "lab"] as const;
export type FarmType = (typeof DEMO_TYPES)[number];
export const isFarmType = (v: unknown): v is FarmType => DEMO_TYPES.includes(v as FarmType);

export type P3 = [number, number, number];

/* ------------------------------ Shared world ------------------------------ */

export const FH = 2.2; // tower floor height
export const NFLOORS = 4; // growing units in every layout
export const TOWER = { x0: -5.5, x1: 5.5, z0: -2, z1: 2 };
export const SLAB = 0.16;
/** The lift shaft (tower) or cart lane (everything else), where crates join the conveyor. */
export const LIFT_X = 6.45;

/** Plant columns along a full-length unit. */
export const PLANT_X = Array.from({ length: 16 }, (_, i) => -4.85 + i * 0.647);
export const PLANT_Z = [-1.1, -0.6, 0.6, 1.1];

/** Sensor tag anchors on a tower floor, relative to its floor height. */
export const SENSOR_POS: P3[] = [
  [-3.4, 1.55, 1.9],
  [3.6, 1.5, 1.9],
  [-0.8, 0.55, 1.6],
  [1.9, FH - 0.2, 0.9],
];

/* --------------------------------- Types --------------------------------- */

type Framing = { ltr: P3; rtl: P3; compact: P3 };

export type Layout = {
  type: FarmType;
  /** World position of each unit's floor centre. */
  units: P3[];
  /** Unit box: w along x, d along z, h up; centred on the unit origin, floor at y = 0. */
  size: { w: number; d: number; h: number };
  /** Plant columns (local x) and rows (local z, and the y the plants stand on, just above a bed). */
  cols: number[];
  rows: { z: number; y: number }[];
  plantScale: number;
  /** Growing beds or trays under the plants: local z, top y, width, height. */
  beds: { z: number; top: number; w: number; h: number }[];
  bedColor: string;
  /** LED bars: local z and y. All bars are ledLen long. */
  leds: { z: number; y: number }[];
  ledLen: number;
  /** Harvest drone: flying height and side (local). */
  sweep: { y: number; z: number };
  /** Where the drone hands a crate to the lift or cart for unit k (world). */
  transfer: (k: number) => P3;
  carrier: "lift" | "cart";
  /** Sensor tags when zoomed in (local), and the unit's label anchor (local). */
  sensors: P3[];
  tag: P3;
  tagAlign: "left" | "center";
  /** Crop yield compared with a full tower floor. */
  yieldScale: number;
  /** Overview: look-at point per screen, and the camera's offset from it (scaled by zoom). */
  over: Framing & { p: P3 };
  /** Zoomed into one unit: look-at and camera offsets from the unit origin. */
  focus: Framing & { p: P3; pCompact: P3 };
  /** Ground kept clear of trees: [x0, z0, x1, z1]. */
  clear: [number, number, number, number][];
};

const at = (x: number, z: number, y = 0.1): P3 => [x, y, z];

/* --------------------------------- Tower --------------------------------- */

const tower: Layout = {
  type: "tower",
  units: [0, 1, 2, 3].map((k): P3 => [0, k * FH, 0]),
  size: { w: 11, d: 4, h: FH },
  cols: PLANT_X,
  rows: PLANT_Z.map((z) => ({ z, y: SLAB + 0.3 })),
  plantScale: 1,
  beds: [-0.85, 0.85].map((z) => ({ z, top: SLAB + 0.28, w: 1.0, h: 0.28 })),
  bedColor: "#4a3a2d",
  leds: [-0.85, 0.85].map((z) => ({ z, y: FH - 0.08 })),
  ledLen: 10.2,
  sweep: { y: 1.45, z: TOWER.z1 + 0.85 },
  transfer: (k) => [LIFT_X, k * FH + SLAB, 0],
  carrier: "lift",
  sensors: SENSOR_POS,
  tag: [TOWER.x0 - 0.3, 1.1, TOWER.z1],
  tagAlign: "left",
  yieldScale: 1,
  over: { ltr: [6.2, 2.6, 1.6], rtl: [-1.2, 2.6, 1.6], compact: [0.6, 3.4, 1.6], p: [26, 19, 31] },
  focus: { ltr: [1.6, 0.8, 0.2], rtl: [-0.8, 0.8, 0.2], compact: [0.4, 0.8, 0.2], p: [10.5, 4.2, 14], pCompact: [9.5, 4.8, 15] },
  clear: [[-9.5, -3, 7.5, 3]],
};

/* ------------------------------- Containers ------------------------------ */

/** Four 40-ft containers side by side; each has two racks of two tiers. */
const CONTAINER_PITCH = 3.5;
const container: Layout = {
  type: "container",
  units: [0, 1, 2, 3].map((k): P3 => [0, 0, 2.2 - k * CONTAINER_PITCH]),
  size: { w: 11.4, d: 2.5, h: 2.6 },
  cols: PLANT_X,
  rows: [
    { z: -0.55, y: 0.52 },
    { z: -0.55, y: 1.42 },
    { z: 0.55, y: 0.52 },
    { z: 0.55, y: 1.42 },
  ],
  plantScale: 0.78,
  beds: [-0.55, 0.55].flatMap((z) => [0.5, 1.4].map((top) => ({ z, top, w: 0.62, h: 0.08 }))),
  bedColor: "#e9edf3",
  leds: [-0.55, 0.55].flatMap((z) => [1.22, 2.12].map((y) => ({ z, y }))),
  ledLen: 10.2,
  sweep: { y: 1.75, z: 1.75 },
  transfer: (k) => at(LIFT_X, 2.2 - k * CONTAINER_PITCH),
  carrier: "cart",
  sensors: [
    [-3.4, 1.95, 1.25],
    [3.6, 1.85, 1.25],
    [-0.8, 0.85, 1.0],
    [1.9, 2.4, 0.3],
  ],
  tag: [-6.0, 1.3, 1.25],
  tagAlign: "left",
  yieldScale: 0.35,
  over: { ltr: [7.4, -0.6, -1.8], rtl: [-2.6, -0.6, -1.8], compact: [-1.4, 0.4, -2.8], p: [27, 27, 33] },
  focus: { ltr: [3, 0.4, 0], rtl: [-2.4, 0.4, 0], compact: [0.4, 0.8, 0], p: [13, 12.5, 18], pCompact: [12, 13.5, 20] },
  clear: [[-7, -10.2, 7.5, 4]],
};

/* ------------------------------- Greenhouse ------------------------------ */

/** One glass house with four bays of waist-high gutters (NFT channels). */
const BAY_PITCH = 3.1;
export const GREENHOUSE = { x0: -6, x1: 6, z0: 2.0 - 3 * BAY_PITCH - 1.55, z1: 2.0 + 1.55, eave: 3.3, ridge: 4.5 };
const greenhouse: Layout = {
  type: "greenhouse",
  units: [0, 1, 2, 3].map((k): P3 => [0, 0, 2.0 - k * BAY_PITCH]),
  size: { w: 11.2, d: 2.8, h: 3.3 },
  cols: PLANT_X,
  rows: [-1.0, -0.35, 0.35, 1.0].map((z) => ({ z, y: 0.98 })),
  plantScale: 0.9,
  beds: [-1.0, -0.35, 0.35, 1.0].map((z) => ({ z, top: 0.96, w: 0.2, h: 0.12 })),
  bedColor: "#f6f8fb",
  leds: [-0.6, 0.6].map((z) => ({ z, y: 3.0 })),
  ledLen: 10.2,
  sweep: { y: 2.15, z: 0 },
  transfer: (k) => at(LIFT_X, 2.0 - k * BAY_PITCH),
  carrier: "cart",
  sensors: [
    [-3.4, 1.7, 1.3],
    [3.6, 1.6, 1.3],
    [-0.8, 1.25, 1.1],
    [1.9, 2.9, 0.6],
  ],
  tag: [-6.3, 1.2, 1.0],
  tagAlign: "left",
  yieldScale: 1.4,
  over: { ltr: [7.4, -0.2, -1.8], rtl: [-2.6, -0.2, -1.8], compact: [-1.4, 0.8, -2.8], p: [27, 26, 33] },
  focus: { ltr: [3, 0.7, 0], rtl: [-2.4, 0.7, 0], compact: [0.4, 1.0, 0], p: [13, 11.5, 18], pCompact: [12, 12.5, 20] },
  clear: [[-7, -10, 7.5, 4.6]],
};

/* ---------------------------------- Lab ---------------------------------- */

/** A research lab with four reach-in growth chambers, four shelves each. */
const LAB_SHELVES = [0.42, 0.9, 1.38, 1.86];
export const LAB = { x0: -5.5, x1: 5.5, z0: -2, z1: 2, h: 3 };
const lab: Layout = {
  type: "lab",
  units: [0, 1, 2, 3].map((k): P3 => [-4.05 + k * 2.7, 0.12, -0.8]),
  size: { w: 2.3, d: 1.2, h: 2.3 },
  cols: Array.from({ length: 6 }, (_, i) => -0.8 + i * 0.32),
  rows: LAB_SHELVES.map((y) => ({ z: 0, y: y + 0.02 })),
  plantScale: 0.5,
  beds: LAB_SHELVES.map((top) => ({ z: 0, top, w: 0.9, h: 0.04 })),
  bedColor: "#dfe5ee",
  leds: LAB_SHELVES.map((y) => ({ z: 0, y: y + 0.4 })),
  ledLen: 2.0,
  sweep: { y: 1.25, z: 1.45 },
  transfer: () => at(LIFT_X, 1.2),
  carrier: "cart",
  sensors: [
    [-0.75, 1.95, 0.65],
    [0.75, 1.45, 0.65],
    [-0.45, 0.55, 0.65],
    [0.55, 2.2, 0.3],
  ],
  tag: [0, 2.65, 0.6],
  tagAlign: "center",
  yieldScale: 0.08,
  over: { ltr: [5.4, 1.0, 0.6], rtl: [-2.4, 1.0, 0.6], compact: [-1.2, 1.2, 0.2], p: [16, 11.5, 19.5] },
  focus: { ltr: [1.4, 1.1, 0.3], rtl: [-1.3, 1.1, 0.3], compact: [0.1, 1.1, 0.3], p: [8.5, 4.6, 12.5], pCompact: [8.5, 5.2, 14] },
  clear: [[-9.5, -3, 7.5, 3]],
};

export const LAYOUTS: Record<FarmType, Layout> = { tower, container, greenhouse, lab };
