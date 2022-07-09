import { GradientTexture, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { a, SpringValue } from "@react-spring/three";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PointLight, Vector3 } from "three";
import {
  AMBIENT_LIGHT_INTENSITY,
  BG_COLORS,
  COLORS,
  POINT_LIGHT_INTENSITY,
  SHAPES,
  SPOT_LIGHT_INTENSITY,
  LIGHT_THEMES,
  EFFECTS,
  SCALES,
  INSTRUMENTS,
  WIDTH,
  SIZE,
  BG_DARK,
  SHAPE_TYPES,
  ROTATION,
  FLASH_LIGHT_COLORS,
} from "./constants";
import {
  pickRandomHash,
  getRandomNumber,
  pickRandomColorWithTheme,
  sortRandom,
  easeInOutSine,
  pickRandom,
  getSizeByAspect,
  pickRandomHashNumberFromArray,
} from "./utils";
import {
  EffectComposer,
  Sepia,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { BASS, HITS, Sample } from "./App";
import { Destination, Filter, start } from "tone";
import {
  Boxes,
  Rings,
  RingsExtra,
  RingsExtra2,
  Squares,
  SquaresExtra,
} from "./Shapes";
import { useSpring } from "react-spring";

interface Intersection {
  index: number;
  shape: number;
}

interface ObjectMeta {
  toRemove?: number[];
  intersectedWith?: Intersection[];
  coveringIndexes?: number[];
}

export interface Object {
  index: number;
  composition: number;
  coveringIndexes: number[];
  shape: number;
  color: string;
  secondColor: string;
}

export const instrument = pickRandomHash(INSTRUMENTS);
export const widthNumber = pickRandomHashNumberFromArray(WIDTH);
// export const width = WIDTH[widthNumber];
export const width = 4;
// const boardRotation = pickRandomHash(ROTATION);
const boardRotation = 0;
const primaryBgColor = pickRandomHash(BG_DARK);
const secondaryBgColor = pickRandomHash(BG_DARK);
const mainTheme = pickRandomHash(LIGHT_THEMES);
const flashLightColor = pickRandomHash(FLASH_LIGHT_COLORS);
const themeColor = pickRandomHash(COLORS);
const themeColor2 = pickRandomHash(COLORS);
const themeColor3 = pickRandomHash(COLORS);
const themeColor4 = pickRandomHash(COLORS);
const effectFilter = pickRandomHash(EFFECTS);
const pointIntensity = pickRandomHash(POINT_LIGHT_INTENSITY);
const spotIntensity = pickRandomHash(SPOT_LIGHT_INTENSITY);
const ambientIntensity = pickRandomHash(AMBIENT_LIGHT_INTENSITY);

export const shapes = new Array(width * width)
  .fill(null)
  .map(() => pickRandomHash(SHAPES));

const objectMeta = shapes.reduce<ObjectMeta[]>((array, shape, index) => {
  if (shape === SHAPE_TYPES.HOR_RECTANGLE) {
    const intersectIndex = index + width;
    const isAnotherRect =
      shapes[intersectIndex] === SHAPE_TYPES.HOR_RECTANGLE ||
      shapes[intersectIndex] === SHAPE_TYPES.VER_RECTANGLE ||
      shapes[intersectIndex] === SHAPE_TYPES.FILLED_SQUARE_LARGE;

    const indexExists = shapes[intersectIndex];
    const lastRow = new Array(width)
      .fill(null)
      .map((o, index) => shapes.length - index, []);

    const index2 = !lastRow.find((n) => n === index) ? [intersectIndex] : [];

    let item: ObjectMeta = {
      coveringIndexes: [index, ...index2],
    };

    if (!!lastRow.find((n) => n === index) || !indexExists) {
      array.push(item);
      return array;
    }

    if (!isAnotherRect) {
      item = { ...item, toRemove: [intersectIndex] };
    } else {
      item = {
        ...item,
        intersectedWith: [
          { index: intersectIndex, shape: shapes[intersectIndex] },
        ],
      };
    }

    array.push(item);
    return array;
  }

  if (shape === SHAPE_TYPES.VER_RECTANGLE) {
    const intersectIndex = index - 1;
    const isAnotherRect =
      shapes[intersectIndex] === SHAPE_TYPES.HOR_RECTANGLE ||
      shapes[intersectIndex] === SHAPE_TYPES.VER_RECTANGLE ||
      shapes[intersectIndex] === SHAPE_TYPES.FILLED_SQUARE_LARGE;

    const indexExists = shapes[intersectIndex];
    const lastColumns = new Array(width).fill(null).map((o, i) => i * width);
    const index2 = !lastColumns.find((n) => n === index) ? [index - 1] : [];

    let item: ObjectMeta = {
      coveringIndexes: [index, ...index2],
    };

    if (!!lastColumns.find((n) => n === index) || !indexExists) {
      array.push(item);
      return array;
    }

    if (!isAnotherRect) {
      item = { ...item, toRemove: [intersectIndex] };
    } else {
      item = {
        ...item,
        intersectedWith: [
          { index: intersectIndex, shape: shapes[intersectIndex] },
        ],
      };
    }

    array.push(item);
    return array;
  }

  if (shape === SHAPE_TYPES.FILLED_SQUARE_LARGE) {
    const isAnotherRect =
      shapes[index - 1] === SHAPE_TYPES.HOR_RECTANGLE ||
      shapes[index - 1] === SHAPE_TYPES.VER_RECTANGLE ||
      shapes[index - 1] === SHAPE_TYPES.FILLED_SQUARE_LARGE;

    const indexExists = shapes[index - 1];
    const lastColumns = new Array(width).fill(null).map((o, i) => i * width);
    const lastRow = new Array(width)
      .fill(null)
      .map((o, index) => shapes.length - index, []);

    const index2 = !lastColumns.find((n) => n === index) ? [index - 1] : [];
    const index3 = !lastRow.find((n) => n === index) ? [index + width] : [];
    const index4 =
      !lastColumns.find((n) => n === index) || !lastRow.find((n) => n === index)
        ? [index + width - 1]
        : [];

    let item: ObjectMeta = {
      coveringIndexes: [index, ...index2, ...index3, ...index4],
    };

    if (!lastColumns.find((n) => n === index) && indexExists) {
      if (!isAnotherRect) {
        item = { ...item, toRemove: [index - 1] };
      } else {
        item = {
          ...item,
          intersectedWith: [{ index: index - 1, shape: shapes[index - 1] }],
        };
      }
    }

    const isAnotherRect2 =
      shapes[index + width] === SHAPE_TYPES.HOR_RECTANGLE ||
      shapes[index + width] === SHAPE_TYPES.VER_RECTANGLE ||
      shapes[index + width] === SHAPE_TYPES.FILLED_SQUARE_LARGE;

    if (!lastRow.find((n) => n === index) && indexExists) {
      if (!isAnotherRect2) {
        const prevRemove = item.toRemove ? [...item.toRemove] : [];

        item = { ...item, toRemove: [...prevRemove, index + width] };
      } else {
        const prevIntersect = item.intersectedWith
          ? [...item.intersectedWith]
          : [];

        item = {
          ...item,
          intersectedWith: [
            ...prevIntersect,
            { index: index + width, shape: shapes[index + width] },
          ],
        };
      }
    }

    const isAnotherRect3 =
      shapes[index + width - 1] === SHAPE_TYPES.HOR_RECTANGLE ||
      shapes[index + width - 1] === SHAPE_TYPES.VER_RECTANGLE ||
      shapes[index + width - 1] === SHAPE_TYPES.FILLED_SQUARE_LARGE;

    if (
      !lastRow.find((n) => n === index) &&
      !lastColumns.find((n) => n === index) &&
      indexExists
    ) {
      if (!isAnotherRect3) {
        const prevRemove = item.toRemove ? [...item.toRemove] : [];

        item = { ...item, toRemove: [...prevRemove, index + width - 1] };
      } else {
        const prevIntersect = item.intersectedWith
          ? [...item.intersectedWith]
          : [];

        item = {
          ...item,
          intersectedWith: [
            ...prevIntersect,
            { index: index + width - 1, shape: shapes[index + width - 1] },
          ],
        };
      }
    }

    array.push(item);
    return array;
  }

  array.push({});
  return array;
}, []);

console.log("objectMeta", objectMeta);

const filteredShapes = shapes.map((shape, i) => {
  const needsRemoval =
    objectMeta.filter((o) => o.toRemove?.find((r) => r === i)).length > 0;

  if (needsRemoval) {
    return SHAPE_TYPES.EMPTY;
  }

  return shape;
});

console.log("shapes", shapes);
console.log("filteredShapes", filteredShapes);

const objects = filteredShapes.map((shape, i) => {
  const color1 = pickRandomColorWithTheme(themeColor, shapes.length);
  const color2 = pickRandomColorWithTheme(themeColor2, shapes.length);
  const color3 = pickRandomColorWithTheme(themeColor3, shapes.length);
  const color4 = pickRandomColorWithTheme(themeColor4, shapes.length);
  const currentColor =
    i < shapes.length / 4
      ? color1
      : i < shapes.length / 2
      ? color2
      : i < shapes.length / 1.5
      ? color3
      : color4;

  const secondColor = pickRandomHash(COLORS);
  const composition = shape + currentColor.charCodeAt(6);
  const intersected = objectMeta.filter((o) =>
    o.coveringIndexes?.find((o) => o === i)
  );

  const coveringIndexes = intersected.reduce<number[]>((arr, o) => {
    if (o.coveringIndexes) {
      const trimmedIndexes = o.coveringIndexes.filter(
        (cov) => !arr.length || arr.find((o, i) => o !== cov)
      );

      arr.push(...trimmedIndexes);
    }

    return arr;
  }, []);

  console.log("intersected", i, coveringIndexes);

  return {
    index: i,
    composition,
    color: currentColor,
    secondColor,
    shape,
    coveringIndexes,
  };
});

// @ts-ignore
window.$fxhashFeatures = {
  instrument,
  primaryBgColor,
  secondaryBgColor,
  lightingTheme: mainTheme,
  shapeThemeColor: themeColor,
  shapeThemeColor2: themeColor2,
  shapeThemeColor3: themeColor3,
  shapeThemeColor4: themeColor4,
  shapeCount: shapes.length,
  shapeComposition: objects.reduce(
    (total, value) => (total += value.composition),
    0
  ),
};

function Lights({
  aspect,
  lightRef,
  lightSpring,
}: {
  aspect: number;
  lightRef: MutableRefObject<PointLight | undefined>;
  lightSpring: {
    flashLight: SpringValue<number>;
    roomLight: SpringValue<number>;
    ambientLight: SpringValue<number>;
  };
}) {
  return (
    <group
      scale={[
        getSizeByAspect(1, aspect),
        getSizeByAspect(1, aspect),
        getSizeByAspect(1, aspect),
      ]}
    >
      {/*
      // @ts-ignore */}
      <a.ambientLight intensity={lightSpring.ambientLight} color={"#ffffff"} />

      {/* // @ts-ignore
       */}
      <a.pointLight
        position={[0, 0, -30]}
        color={"#ffffff"}
        intensity={lightSpring.roomLight}
      />

      {/* // @ts-ignore
       */}
      <a.pointLight
        ref={lightRef}
        position={[0, 0, -10]}
        color={flashLightColor}
        intensity={lightSpring.flashLight}
        decay={2}
        distance={2}
      />
    </group>
  );
}

const Scene = () => {
  const { viewport, aspect, camera } = useThree((state) => ({
    viewport: state.viewport,
    aspect: state.viewport.aspect,
    camera: state.camera,
  }));

  const lightRef = useRef<PointLight>();
  const [isPointerDown, setIsPointerDown] = useState(false);
  const toneInitialized = useRef(false);
  const [lastPlayedScale, setLastPlayedScale] = useState<number>();
  const [hits, setHits] = useState<Sample[][]>();
  const availableScales = useMemo(
    () => SCALES.filter(({ index }) => index !== lastPlayedScale),
    [lastPlayedScale]
  );

  const [lightSpring, setLightSpring] = useSpring(() => ({
    flashLight: 0,
    roomLight: 1,
    ambientLight: 0.5,
  }));

  useEffect(() => {
    const filter = new Filter(4000, "lowpass");

    BASS.forEach((bass) => bass.sampler.toDestination());
    HITS.forEach((hit) => {
      if (instrument === 0) {
        hit.sampler.chain(filter, Destination);
      } else {
        hit.sampler.toDestination();
      }
    });

    const tones = objects.map(({ shape }) => {
      switch (shape) {
        case SHAPE_TYPES.HOR_RECTANGLE:
        case SHAPE_TYPES.VER_RECTANGLE:
          const scale = pickRandomHash(SCALES);

          return [
            HITS[pickRandomHash(scale.sequence)],
            HITS[pickRandomHash(scale.sequence)],
          ];
        case SHAPE_TYPES.FILLED_SQUARE_LARGE:
          const scale2 = pickRandomHash(SCALES);

          return [
            HITS[pickRandomHash(scale2.sequence)],
            HITS[pickRandomHash(scale2.sequence)],
            HITS[pickRandomHash(scale2.sequence)],
            BASS[scale2.index],
          ];
        default:
          return [pickRandomHash(HITS)];
      }
    });

    setHits(tones);
  }, []);

  const initializeTone = useCallback(async () => {
    await start();
    toneInitialized.current = true;
  }, []);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      event.preventDefault();

      const mouse = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
      // console.log(aspect);
      const cameraPosition = new Vector3(
        aspect > 1 ? camera.position.x : camera.position.x / aspect,
        aspect > 1 ? camera.position.y : camera.position.y * aspect,
        // aspect > 1 ? camera.position.z : camera.position.z * aspect,
        camera.position.z
      );

      const vector = new Vector3(mouse.x, mouse.y, -1);
      vector.unproject(camera);
      const dir = vector.sub(cameraPosition).normalize();
      const distance = -cameraPosition.z / dir.z;
      const pos = cameraPosition.clone().add(dir.multiplyScalar(distance));

      lightRef.current?.position.copy(new Vector3(pos.x, pos.y, pos.z - 1));
    },
    [camera, aspect]
  );

  useEffect(() => {
    setLightSpring.start({
      flashLight: isPointerDown ? 10 : 0,
      roomLight: isPointerDown ? 0 : 1,
      ambientLight: isPointerDown ? 0.3 : 0.5,
    });
  }, [setLightSpring, isPointerDown]);

  const onPointerDown = useCallback(() => {
    if (!toneInitialized.current) {
      initializeTone();
    }

    setIsPointerDown(true);
  }, [initializeTone]);

  const onPointerUp = useCallback(() => {
    setIsPointerDown(false);
  }, []);

  useEffect(() => {
    console.log("123123123");
    document.addEventListener("pointermove", onPointerMove, false);
    document.addEventListener("pointerdown", onPointerDown, false);
    document.addEventListener("pointerup", onPointerUp, false);
  }, [onPointerMove, onPointerDown, onPointerUp]);

  const renderBackground = useCallback(() => {
    const dimension = aspect > 1 ? viewport.width : viewport.height;

    return (
      // @ts-ignore
      <mesh
        position={[0, 0, getSizeByAspect(0.1, aspect)]}
        rotation={[Math.PI, 0, Math.PI / 4]}
      >
        <planeBufferGeometry
          args={[
            getSizeByAspect(dimension * 2, aspect),
            getSizeByAspect(dimension * 2, aspect),
          ]}
        />
        <meshBasicMaterial>
          <GradientTexture
            // stops={[0, 0.25, 0.75, 1]}
            stops={[0, 1]}
            colors={[
              secondaryBgColor,
              primaryBgColor,
              // primaryBgColor,
              // secondaryBgColor,
            ]}
            size={1024}
          />
        </meshBasicMaterial>
      </mesh>
    );
  }, [viewport, aspect]);

  return (
    <>
      {/* <color attach="background" args={[primaryBgColor]} /> */}
      <OrbitControls enabled={false} />
      {renderBackground()}
      <Lights aspect={aspect} lightRef={lightRef} lightSpring={lightSpring} />
      <group rotation={[0, 0, boardRotation]}>
        <group
          position={[
            getSizeByAspect((-width + SIZE) / 2, aspect),
            getSizeByAspect((-width + SIZE) / 2, aspect),
            0,
          ]}
        >
          <Boxes
            objects={objects}
            aspect={aspect}
            hits={hits}
            isPointerDown={isPointerDown}
          />
          <Squares objects={objects} aspect={aspect} />
          <SquaresExtra objects={objects} aspect={aspect} />
          <Rings objects={objects} aspect={aspect} />
          <RingsExtra objects={objects} aspect={aspect} />
          <RingsExtra2 objects={objects} aspect={aspect} />
        </group>
      </group>
    </>
  );
};

export default Scene;
