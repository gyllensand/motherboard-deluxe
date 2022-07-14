import { MathUtils } from "three";

declare const fxrand: () => number;

export const sortRandom = <T>(array: T[]) =>
  array.sort((a, b) => 0.5 - Math.random());

export const pickRandom = <T>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)];

export const sortRandomHash = <T>(array: T[]) =>
  array.sort((a, b) => 0.5 - fxrand());

export const pickRandomHash = <T>(array: T[]) =>
  array[Math.floor(fxrand() * array.length)];

export const pickRandomHashNumberFromArray = <T>(array: T[]) =>
  Math.floor(fxrand() * array.length);

export const pickRandomIntFromInterval = (min: number, max: number) => {
  return Math.floor(fxrand() * (max - min + 1) + min);
};

export const pickRandomDecimalFromInterval = (
  min: number,
  max: number,
  decimalPlaces = 2
) => {
  const rand = fxrand() * (max - min) + min;
  const power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
};

export const getRandomNumber = () => fxrand();

export const range = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  a: number
) => MathUtils.lerp(x2, y2, MathUtils.inverseLerp(x1, y1, a));

export const getSizeByAspect = (size: number, aspect: number) =>
  aspect > 1 ? size : size * aspect;

export const adjustColor = (color: string, amount: number) => {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
};

export const pickRandomColorWithTheme = (
  color: string,
  theme: string[],
  count: number
) => {
  const primaryColor = new Array(count * 2).fill(null).map(() => color);

  return pickRandomHash([...primaryColor, ...theme]);
};

export const easeInOutSine = (t: number, b: number, _c: number, d: number) => {
  var c = _c - b;
  return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
};

export const minMaxNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
