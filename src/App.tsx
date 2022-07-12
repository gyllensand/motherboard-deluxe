import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene, { instrument, widthNumber } from "./Scene";
import { Sampler } from "tone";
import { ZOOM } from "./constants";

console.log(
  "%c * Computer Emotions * ",
  "color: #d80fe7; font-size: 16px; background-color: #000000;"
);

const path = instrument === 0 ? "piano" : "synth";
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
        1: `${path}-a2sB.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 200,
    sampler: new Sampler({
      urls: {
        1: `${path}-c3B.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 300,
    sampler: new Sampler({
      urls: {
        1: `${path}-d3sB.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 400,
    sampler: new Sampler({
      urls: {
        1: `${path}-g2sB.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 500,
    sampler: new Sampler({
      urls: {
        1: `${path}-g3B.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 600,
    sampler: new Sampler({
      urls: {
        1: `${path}-f2B.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 700,
    sampler: new Sampler({
      urls: {
        1: `${path}-g2B.mp3`,
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
        1: `${path}-d6s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 1,
    sampler: new Sampler({
      urls: {
        1: `${path}-d7s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 2,
    sampler: new Sampler({
      urls: {
        1: `${path}-d6.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 3,
    sampler: new Sampler({
      urls: {
        1: `${path}-a5s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 4,
    sampler: new Sampler({
      urls: {
        1: `${path}-a6s.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 5,
    sampler: new Sampler({
      urls: {
        1: `${path}-g5.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 6,
    sampler: new Sampler({
      urls: {
        1: `${path}-g6.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 7,
    sampler: new Sampler({
      urls: {
        1: `${path}-c6.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 8,
    sampler: new Sampler({
      urls: {
        1: `${path}-g7.mp3`,
      },
      baseUrl,
    }),
  },
  {
    index: 9,
    sampler: new Sampler({
      urls: {
        1: `${path}-d5s.mp3`,
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
        1: `${path}-g5s.mp3`,
      },
      baseUrl,
    }),
  },
];

const App = () => {
  return (
    <>
      {/* <Canvas linear flat shadows camera={{ position: [0, 0, 200]}}> */}
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
    </>
  );
};

export default App;
