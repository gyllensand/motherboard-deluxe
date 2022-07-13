import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene, { instrument, widthNumber } from "./Scene";
import { Sampler } from "tone";
import { ZOOM } from "./constants";

console.log(
  "%c * Computer Emotions * ",
  "color: #d80fe7; font-size: 16px; background-color: #000000;"
);

// const path = instrument === 0 ? "piano" : "synth";
const path = "synth";
const baseUrl = `${process.env.PUBLIC_URL}/audio/${path}/`;

export interface Sample {
  index: number;
  sampler: Sampler;
}

export const BASS: Sample[] = [
  {
    index: 100,
    sampler: new Sampler({
      urls: {
        1: `${path}-a4sB.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 200,
    sampler: new Sampler({
      urls: {
        1: `${path}-c4B.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 300,
    sampler: new Sampler({
      urls: {
        1: `${path}-c4sB.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 400,
    sampler: new Sampler({
      urls: {
        1: `${path}-c5B.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 500,
    sampler: new Sampler({
      urls: {
        1: `${path}-d4sB.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 600,
    sampler: new Sampler({
      urls: {
        1: `${path}-f4B.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 700,
    sampler: new Sampler({
      urls: {
        1: `${path}-g4B.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 800,
    sampler: new Sampler({
      urls: {
        1: `${path}-g4sB.mp3`,
      },
      baseUrl,
    }),
  },
];

export const HITS: Sample[] = [
  {
    index: 0,
    sampler: new Sampler({
      urls: {
        1: `${path}-a5s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 1,
    sampler: new Sampler({
      urls: {
        1: `${path}-c5.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 2,
    sampler: new Sampler({
      urls: {
        1: `${path}-c5s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 3,
    sampler: new Sampler({
      urls: {
        1: `${path}-c6.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 4,
    sampler: new Sampler({
      urls: {
        1: `${path}-c6s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 5,
    sampler: new Sampler({
      urls: {
        1: `${path}-c7.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 6,
    sampler: new Sampler({
      urls: {
        1: `${path}-c7s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 7,
    sampler: new Sampler({
      urls: {
        1: `${path}-d5s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 8,
    sampler: new Sampler({
      urls: {
        1: `${path}-d6s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 9,
    sampler: new Sampler({
      urls: {
        1: `${path}-d7s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 10,
    sampler: new Sampler({
      urls: {
        1: `${path}-f5.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 11,
    sampler: new Sampler({
      urls: {
        1: `${path}-f6.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 12,
    sampler: new Sampler({
      urls: {
        1: `${path}-f7.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 13,
    sampler: new Sampler({
      urls: {
        1: `${path}-g4s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 14,
    sampler: new Sampler({
      urls: {
        1: `${path}-g5.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 15,
    sampler: new Sampler({
      urls: {
        1: `${path}-g5s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 16,
    sampler: new Sampler({
      urls: {
        1: `${path}-g6.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 17,
    sampler: new Sampler({
      urls: {
        1: `${path}-g6s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 18,
    sampler: new Sampler({
      urls: {
        1: `${path}-g7.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 19,
    sampler: new Sampler({
      urls: {
        1: `${path}-g7s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 20,
    sampler: new Sampler({
      urls: {
        1: `${path}-a4s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 21,
    sampler: new Sampler({
      urls: {
        1: `${path}-a6s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 22,
    sampler: new Sampler({
      urls: {
        1: `${path}-a7s.mp3`,
      },
      baseUrl,
    }),
  },
];

const App = () => {
  return (
    <Canvas
      flat
      shadows
      dpr={window.devicePixelRatio}
      camera={{ position: [0, 0, ZOOM[widthNumber]], near: 1, far: 250 }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
};

export default App;
