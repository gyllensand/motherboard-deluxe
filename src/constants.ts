export const EFFECTS = [...new Array(60).fill(null).map(() => 0), 1];

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
  ...new Array(2).fill(null).map(() => 10),
];

export const WIDTH = [10, 11, 12, 12, 13, 13, 14, 14];
export const SIZE = 1;
export const ZOOM = [-8, -9, -10, -10, -11, -11, -11.5, -11.5];

export const SCALES = [
  {
    index: 0,
    bass: 800,
    sequence: [19, 17, 8, 3, 15],
  },
  {
    index: 1,
    bass: 400,
    sequence: [18, 16, 8, 3, 14],
  },
  {
    index: 2,
    bass: 600,
    sequence: [12, 11, 3, 15, 10],
  },
  {
    index: 3,
    bass: 300,
    sequence: [9, 11, 4, 15, 10],
  },
  {
    index: 4,
    bass: 500,
    sequence: [6, 8, 0, 14, 7],
  },
  {
    index: 5,
    bass: 100,
    sequence: [6, 4, 15, 10, 2],
  },
  {
    index: 6,
    bass: 600,
    sequence: [5, 3, 15, 7, 1],
  },
  {
    index: 7,
    bass: 500,
    sequence: [21, 0, 14, 7, 20],
  },
  {
    index: 8,
    bass: 800,
    sequence: [17, 15, 7, 1, 13],
  },
  {
    index: 9,
    bass: 200,
    sequence: [22, 3, 14, 7, 1],
  },
  {
    index: 10,
    bass: 300,
    sequence: [12, 4, 15, 10, 2],
  },
  {
    index: 11,
    bass: 600,
    sequence: [9, 3, 15, 10, 1],
  },
  {
    index: 12,
    bass: 700,
    sequence: [5, 8, 0, 14, 7],
  },
  {
    index: 13,
    bass: 600,
    sequence: [19, 11, 3, 10, 1],
  },
  {
    index: 14,
    bass: 300,
    sequence: [9, 4, 15, 2, 13],
  },
  {
    index: 15,
    bass: 500,
    sequence: [21, 8, 14, 7, 20],
  },
];

export const BG_DARK = ["#000000", "#0b0b4b", "#1b3342", "#1b4225", "#632331"];
export const BG_LIGHT = ["#497fff", "#30f8a0", "#f97b9c", "#fe7418", "#75007e"];

export const BG_COLORS = [BG_DARK, BG_DARK, BG_LIGHT];

export const COLORS_LIGHT = [
  "#ffffff",
  "#e0feff",
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
];

export const COLORS_DARK = [
  "#FCEEB5",
  "#ffce00",
  "#eb3434",
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
  "#1b4225",
  "#1b3342",
  "#0b0b4b",
];

export const COLORS = [COLORS_LIGHT, COLORS_DARK];

export const LIGHT_THEMES = [
  ...new Array(40).fill(null).map(() => "#ffffff"),
  "#EE786E",
  "#344df2",
  "#eb3434",
  "#dc0fc0",
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
