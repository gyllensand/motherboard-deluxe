export interface Theme {
  theme: "light" | "dark";
  colors: string[];
}

export const DEFAULT_BPM = 110;

export const RING_SEGMENTS = 80;

export const EFFECTS = [
  ...new Array(16).fill(null).map(() => 0),
  ...new Array(16).fill(null).map(() => 1),
  2,
];

export const INSTRUMENTS = [0, 1];

export const ROTATION = [0, Math.PI / 2];

export enum SHAPE_TYPES {
  EMPTY = 0,
  FILLED_SQUARE = 1,
  FILLED_TILTED_SQUARE = 2,
  STROKED_SQUARE = 3,
  STROKED_TILTED_SQUARE = 4,
  STROKED_CIRCLE_PULSE = 5,
  STROKED_CIRCLE_SOLID = 6,
  STROKED_CIRCLE = 7,
  HOR_RECTANGLE = 8,
  VER_RECTANGLE = 9,
  FILLED_SQUARE_LARGE = 10,
}

export const SHAPES = [
  ...new Array(20).fill(null).map(() => 1),
  ...new Array(3).fill(null).map(() => 2),
  ...new Array(3).fill(null).map(() => 3),
  ...new Array(3).fill(null).map(() => 4),
  ...new Array(3).fill(null).map(() => 5),
  ...new Array(10).fill(null).map(() => 6),
  ...new Array(3).fill(null).map(() => 7),
  ...new Array(3).fill(null).map(() => 8),
  ...new Array(3).fill(null).map(() => 9),
  ...new Array(1).fill(null).map(() => 10),
];

export const SHAPE_METALNESS = [0.5, 0.75];
export const SHAPE_ROUGHNESS = [0.75, 1];

export const WIDTH = [10, 12, 14];
export const SIZE = 1;
export const ZOOM = [-8, -10, -11];

export const AMBIENT_LIGHT_INTENSITY = [1.5, 2];
export const POINT_LIGHT_INTENSITY = [0.5, 0.7, 0.9];
export const SPOT_LIGHT_INTENSITY = [0.5, 0.7];

export const SCALES = [
  {
    index: 0,
    bass: 2,
    sequence: [3, 0, 1, 4, 6, 0, 3, 5],
  },
  {
    index: 1,
    bass: 4,
    sequence: [9, 2, 6, 4, 2, 3, 5, 10],
  },
  {
    index: 2,
    bass: 1,
    sequence: [7, 4, 8, 1, 6, 7, 5, 9],
  },
  {
    index: 3,
    bass: 3,
    sequence: [11, 0, 1, 4, 6, 0, 3, 10],
  },
  {
    index: 4,
    bass: 0,
    sequence: [3, 0, 1, 4, 6, 0, 2, 3],
  },
  {
    index: 5,
    bass: 5,
    sequence: [11, 0, 1, 4, 6, 0, 3, 11],
  },
  {
    index: 6,
    bass: 6,
    sequence: [3, 0, 4, 1, 4, 6, 0, 3],
  },
];

export const BG_COLORS = [
  "#A2CCB6",
  "#FCEEB5",
  "#EE786E",
  "#e0feff",
  "lightpink",
  "lightblue",
];

export const BG_DARK = ["#000000", "#0b0b4b", "#1b3342", "#1b4225", "#632331"];

export const COLORS = [
  "#ffffff",
  "#e0feff",
  "#cccccc",
  "#FCEEB5",
  "#ffce00",
  "#eb3434",
  "#30f8a0",
  "#A2CCB6",
  "lightpink",
  "#f97b9c",
  "#EE786E",
  "#fe7418",
  "lightblue",
  "#00f7fb",
  "#497fff",
  "#344df2",
  "#dc0fc0",
  "#75007e",
  "#aa4807",
  "#800b0b",
  // "#1b4225",
  // "#1b3342",
  // "#0b0b4b",
  // "#000000",
];

export const LIGHT_THEMES = [
  ...new Array(60).fill(null).map(() => "#ffffff"),
  "#A2CCB6",
  "#FCEEB5",
  "#EE786E",
  "#e0feff",
  "lightpink",
  "lightblue",
];

export const FLASH_LIGHT_COLORS = [
  ...new Array(20).fill(null).map(() => "#ffffff"),
  "#ffce00",
  "#30f8a0",
  "#eb3434",
  "#fe7418",
  "lightpink",
  "#00f7fb",
  "#dc0fc0",
];
