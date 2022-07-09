import { useMemo, useRef, useEffect, useState } from "react";
import { a } from "@react-spring/three";
import { Color, Object3D, InstancedMesh } from "three";
import { SHAPE_TYPES } from "./constants";
import { Object, width } from "./Scene";
import { useSpring, useSprings } from "react-spring";
import { useGesture } from "react-use-gesture";
import { useFrame } from "@react-three/fiber";
import {
  easeInOutSine,
  getSizeByAspect,
  pickRandomDecimalFromInterval,
} from "./utils";
import { Sample } from "./App";

interface ActiveShape {
  index: number;
  shape: number;
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const minMaxNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function updateInstancedMeshMatrices({
  mesh,
  scale,
  activeShapes,
  tempObject,
  objects,
  aspect,
  isPointerDown,
}: {
  mesh?: InstancedMesh;
  scale: number;
  activeShapes?: ActiveShape[];
  tempObject: Object3D;
  objects: Object[];
  aspect: number;
  isPointerDown: boolean;
}) {
  if (!mesh || !isPointerDown) return;
  console.log("activeShapes", activeShapes);
  let i = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      let innerId = i;
      const matchingId = activeShapes?.find(({ index }) => index === innerId);

      if (!activeShapes || !matchingId) {
        i++;
        continue;
      }

      if (
        objects[matchingId.index].shape === SHAPE_TYPES.FILLED_TILTED_SQUARE
      ) {
        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y, aspect),
          0
        );
        tempObject.scale.set(0.5 * scale, 0.5 * scale, 0.5);
        tempObject.rotation.set(0, 0, Math.PI / 4);
      } else if (
        objects[matchingId.index].shape === SHAPE_TYPES.FILLED_SQUARE_LARGE
      ) {
        tempObject.position.set(
          getSizeByAspect(x + 0.5, aspect),
          getSizeByAspect(y - 0.5, aspect),
          0
        );
        tempObject.scale.set(2.43 * scale, 2.46 * scale, 1.03);
        tempObject.rotation.set(0, 0, 0);
      } else if (
        objects[matchingId.index].shape === SHAPE_TYPES.HOR_RECTANGLE
      ) {
        tempObject.position.set(
          getSizeByAspect(x + 0.5, aspect),
          getSizeByAspect(y, aspect),
          0
        );
        tempObject.scale.set(2.43 * scale, 1 * scale, 1.02);
        tempObject.rotation.set(0, 0, 0);
      } else if (
        objects[matchingId.index].shape === SHAPE_TYPES.VER_RECTANGLE
      ) {
        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y - 0.5, aspect),
          0
        );
        tempObject.scale.set(1 * scale, 2.43 * scale, 1.01);
        tempObject.rotation.set(0, 0, 0);
      } else {
        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y, aspect),
          0
        );
        tempObject.scale.set(1 * scale, 1 * scale, 1);
        tempObject.rotation.set(0, 0, 0);
      }

      // const id = innerId++;

      tempObject.updateMatrix();
      mesh.setMatrixAt(matchingId.index, tempObject.matrix);
      mesh.instanceMatrix.needsUpdate = true;

      i++;
    }
  }
}

export function Rings({
  objects,
  aspect,
}: {
  objects: Object[];
  aspect: number;
}) {
  const tempColor = useMemo(() => new Color(), []);
  const tempObject = useMemo(() => new Object3D(), []);
  const meshRef = useRef<InstancedMesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(objects.length)
          .fill(null)
          .flatMap((o, i) => tempColor.set(objects[i].color).toArray())
      ),
    [tempColor, objects]
  );

  useEffect(() => {
    let i = 0;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        if (
          objects[i].shape !== SHAPE_TYPES.STROKED_CIRCLE &&
          objects[i].shape !== SHAPE_TYPES.STROKED_CIRCLE_PULSE
        ) {
          i++;
          continue;
        }

        const id = i++;

        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y, aspect),
          0
        );
        tempObject.scale.set(1, 1, 1);
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(id, tempObject.matrix);
      }
    }

    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <a.instancedMesh
      ref={meshRef}
      args={[undefined, undefined, objects.length]}
    >
      <torusBufferGeometry
        attach="geometry"
        args={[
          getSizeByAspect(0.15, aspect),
          getSizeByAspect(0.03, aspect),
          32,
          64,
        ]}
      >
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </torusBufferGeometry>
      <meshStandardMaterial vertexColors />
    </a.instancedMesh>
  );
}

export function RingsExtra({
  objects,
  aspect,
}: {
  objects: Object[];
  aspect: number;
}) {
  const tempColor = useMemo(() => new Color(), []);
  const tempObject = useMemo(() => new Object3D(), []);
  const meshRef = useRef<InstancedMesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(objects.length)
          .fill(null)
          .flatMap((o, i) => tempColor.set(objects[i].color).toArray())
      ),
    [tempColor, objects]
  );

  const timings = useMemo<number[]>(() => [], []);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      timings.push(pickRandomDecimalFromInterval(1, 2, 2));
    }
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    let i = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        if (objects[i].shape !== SHAPE_TYPES.STROKED_CIRCLE_PULSE) {
          i++;
          continue;
        }

        const id = i++;

        const scale = easeInOutSine(
          minMaxNumber(Math.sin(time / timings[i]), 0, 1),
          0,
          1,
          1
        );

        tempObject.scale.set(scale, scale, 1);
        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y, aspect),
          0
        );
        tempObject.rotation.set(Math.PI, 0, 0);
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(id, tempObject.matrix);
      }
    }
    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <a.instancedMesh
      ref={meshRef}
      args={[undefined, undefined, objects.length]}
    >
      <circleBufferGeometry
        attach="geometry"
        args={[getSizeByAspect(1, aspect), 64, 0, Math.PI * 2]}
      >
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </circleBufferGeometry>
      <meshStandardMaterial vertexColors transparent opacity={0.2} />
    </a.instancedMesh>
  );
}

export function RingsExtra2({
  objects,
  aspect,
}: {
  objects: Object[];
  aspect: number;
}) {
  const tempColor = useMemo(() => new Color(), []);
  const tempObject = useMemo(() => new Object3D(), []);
  const meshRef = useRef<InstancedMesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(objects.length)
          .fill(null)
          .flatMap((o, i) => tempColor.set(objects[i].secondColor).toArray())
      ),
    [tempColor, objects]
  );

  const timings = useMemo<number[]>(() => [], []);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      timings.push(pickRandomDecimalFromInterval(0.5, 1.5, 2));
    }
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    let i = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        if (objects[i].shape !== SHAPE_TYPES.STROKED_CIRCLE_SOLID) {
          i++;
          continue;
        }

        const id = i++;

        const scale = easeInOutSine(
          minMaxNumber(Math.sin(time / timings[i]), 0, 1),
          0,
          1,
          1
        );

        tempObject.scale.set(scale, scale, 1);
        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y, aspect),
          0
        );
        tempObject.rotation.set(Math.PI, 0, 0);
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(id, tempObject.matrix);
      }
    }
    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <a.instancedMesh
      ref={meshRef}
      args={[undefined, undefined, objects.length]}
    >
      <circleBufferGeometry
        attach="geometry"
        args={[getSizeByAspect(0.13, aspect), 64, 0, Math.PI * 2]}
      >
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </circleBufferGeometry>
      <meshStandardMaterial vertexColors />
    </a.instancedMesh>
  );
}

export function Squares({
  objects,
  aspect,
}: {
  objects: Object[];
  aspect: number;
}) {
  const tempColor = useMemo(() => new Color(), []);
  const tempObject = useMemo(() => new Object3D(), []);
  const meshRef = useRef<InstancedMesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(objects.length)
          .fill(null)
          .flatMap((o, i) => tempColor.set(objects[i].color).toArray())
      ),
    [tempColor, objects]
  );

  useEffect(() => {
    let i = 0;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        if (
          objects[i].shape !== SHAPE_TYPES.STROKED_SQUARE &&
          objects[i].shape !== SHAPE_TYPES.STROKED_TILTED_SQUARE
        ) {
          i++;
          continue;
        }

        if (objects[i].shape === SHAPE_TYPES.STROKED_TILTED_SQUARE) {
          tempObject.scale.set(0.6, 0.6, 1);
          tempObject.rotation.set(0, 0, 0);
        } else {
          tempObject.scale.set(0.7, 0.7, 1);
          tempObject.rotation.set(0, 0, Math.PI / 4);
        }

        const id = i++;
        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y, aspect),
          0
        );
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(id, tempObject.matrix);
      }
    }

    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <a.instancedMesh
      ref={meshRef}
      args={[undefined, undefined, objects.length]}
    >
      <torusBufferGeometry
        attach="geometry"
        args={[
          getSizeByAspect(0.3, aspect),
          getSizeByAspect(0.06, aspect),
          32,
          4,
        ]}
      >
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </torusBufferGeometry>
      <meshStandardMaterial vertexColors />
    </a.instancedMesh>
  );
}

export function SquaresExtra({
  objects,
  aspect,
}: {
  objects: Object[];
  aspect: number;
}) {
  const tempColor = useMemo(() => new Color(), []);
  const tempObject = useMemo(() => new Object3D(), []);
  const meshRef = useRef<InstancedMesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(objects.length)
          .fill(null)
          .flatMap((o, i) => tempColor.set(objects[i].color).toArray())
      ),
    [tempColor, objects]
  );

  const timings = useMemo<number[]>(() => [], []);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      timings.push(pickRandomDecimalFromInterval(0.1, 1, 2));
    }
  }

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    let i = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        if (
          objects[i].shape !== SHAPE_TYPES.STROKED_SQUARE &&
          objects[i].shape !== SHAPE_TYPES.STROKED_TILTED_SQUARE
        ) {
          i++;
          continue;
        }

        if (objects[i].shape === SHAPE_TYPES.STROKED_TILTED_SQUARE) {
          const scale = easeInOutSine(
            minMaxNumber(Math.sin(time / timings[i]), 0.4, 1.2),
            0.4,
            1.2,
            1.2
          );

          tempObject.scale.set(scale, scale, 1);
          tempObject.rotation.set(0, 0, 0);
        } else {
          const scale = easeInOutSine(
            minMaxNumber(Math.sin(time / timings[i]), 0.4, 1.4),
            0.4,
            1.4,
            1.4
          );

          tempObject.scale.set(scale, scale, 1);
          tempObject.rotation.set(0, 0, Math.PI / 4);
        }

        const id = i++;
        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y, aspect),
          0
        );
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(id, tempObject.matrix);
      }
    }
    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <a.instancedMesh
      ref={meshRef}
      args={[undefined, undefined, objects.length]}
    >
      <torusBufferGeometry
        attach="geometry"
        args={[
          getSizeByAspect(0.3, aspect),
          getSizeByAspect(0.02, aspect),
          32,
          4,
        ]}
      >
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </torusBufferGeometry>
      <meshStandardMaterial vertexColors />
    </a.instancedMesh>
  );
}

export function Boxes({
  objects,
  aspect,
  isPointerDown,
  hits,
}: {
  objects: Object[];
  aspect: number;
  isPointerDown: boolean;
  hits?: Sample[][];
}) {
  const tempColor = useMemo(() => new Color(), []);
  const tempObject = useMemo(() => new Object3D(), []);
  const [activeShapes, setActiveShapes] = useState<ActiveShape[]>();
  const meshRef = useRef<InstancedMesh>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(objects.length)
          .fill(null)
          .flatMap((o, i) => tempColor.set(objects[i].color).toArray())
      ),
    [tempColor, objects]
  );

  const [springs] = useSprings(objects.length, () => ({
    scale: 1,
    config: { mass: 5, tension: 1000, friction: 50, precision: 0.0001 },
  }));

  const prevActive = usePrevious(activeShapes);

  const bind = useGesture({
    onPointerOver: (e) => {
      e.event.stopPropagation();

      // @ts-ignore
      const id = e.event.instanceId;

      if (prevActive !== undefined && prevActive?.find((o) => o.index === id)) {
        return;
      }

      const mainCoveringIndexes = objects[id].coveringIndexes;
      const intersected = objects.reduce<ActiveShape[]>((arr, item, index) => {
        const match = item.coveringIndexes.filter((a) =>
          mainCoveringIndexes.find((b) => a === b)
        );

        if (
          match.length &&
          item.shape !== SHAPE_TYPES.EMPTY &&
          !arr.find((o) => o.index === item.index)
        ) {
          arr.push({ index: item.index, shape: item.shape });
        }

        return arr;
      }, []);

      if (intersected?.length) {
        console.log(intersected);

        setActiveShapes([...intersected]);
      } else {
        setActiveShapes([{ index: id, shape: objects[id].shape }]);
      }
    },
    onPointerOut: (e) => {
      e.event.stopPropagation();
      setActiveShapes(undefined);
    },
  });

  const getScale = (shape?: SHAPE_TYPES) => {
    switch (shape) {
      case SHAPE_TYPES.HOR_RECTANGLE:
      case SHAPE_TYPES.VER_RECTANGLE:
        return 1.125;
      case SHAPE_TYPES.FILLED_SQUARE_LARGE:
        return 1.1;
      default:
        return 1.2;
    }
  };

  useEffect(() => {
    objects.forEach(({ shape }, index) => {
      const scaleTo = activeShapes ? getScale(shape) : 1.2;

      springs[index].scale.start({
        from: {
          scale: activeShapes ? 1 : scaleTo,
        },
        to: {
          scale: activeShapes ? scaleTo : 1,
        },
        reverse: true,
        onChange: (props, spring) => {
          updateInstancedMeshMatrices({
            mesh: meshRef.current,
            scale: spring.get(),
            tempObject,
            activeShapes,
            aspect,
            objects,
            isPointerDown,
          });
        },
      });
    });

    let i = 0;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        if (
          objects[i].shape !== SHAPE_TYPES.FILLED_SQUARE &&
          objects[i].shape !== SHAPE_TYPES.FILLED_SQUARE_LARGE &&
          objects[i].shape !== SHAPE_TYPES.FILLED_TILTED_SQUARE &&
          objects[i].shape !== SHAPE_TYPES.HOR_RECTANGLE &&
          objects[i].shape !== SHAPE_TYPES.VER_RECTANGLE
        ) {
          i++;
          continue;
        }

        if (objects[i].shape === SHAPE_TYPES.FILLED_TILTED_SQUARE) {
          tempObject.position.set(
            getSizeByAspect(x, aspect),
            getSizeByAspect(y, aspect),
            0
          );
          tempObject.scale.set(0.5, 0.5, 0.5);
          tempObject.rotation.set(0, 0, Math.PI / 4);
        } else if (objects[i].shape === SHAPE_TYPES.FILLED_SQUARE_LARGE) {
          tempObject.position.set(
            getSizeByAspect(x + 0.5, aspect),
            getSizeByAspect(y - 0.5, aspect),
            0
          );
          tempObject.scale.set(2.43, 2.43, 1.03);
          tempObject.rotation.set(0, 0, 0);
        } else if (objects[i].shape === SHAPE_TYPES.HOR_RECTANGLE) {
          tempObject.position.set(
            getSizeByAspect(x + 0.5, aspect),
            getSizeByAspect(y, aspect),
            0
          );
          tempObject.scale.set(2.43, 1, 1.02);
          tempObject.rotation.set(0, 0, 0);
        } else if (objects[i].shape === SHAPE_TYPES.VER_RECTANGLE) {
          tempObject.position.set(
            getSizeByAspect(x, aspect),
            getSizeByAspect(y - 0.5, aspect),
            0
          );
          tempObject.scale.set(1, 2.43, 1.01);
          tempObject.rotation.set(0, 0, 0);
        } else {
          tempObject.position.set(
            getSizeByAspect(x, aspect),
            getSizeByAspect(y, aspect),
            0
          );
          tempObject.scale.set(1, 1, 1);
          tempObject.rotation.set(0, 0, 0);
        }

        const id = i++;

        // if (id === active && hits && isPointerDown) {
        //   hits[id].forEach((hit) => {
        //     hit.sampler.triggerAttack("C#-1");
        //   });
        // }

        tempObject.updateMatrix();
        meshRef.current!.geometry.attributes.color.needsUpdate = true;
        meshRef.current!.setMatrixAt(id, tempObject.matrix);
      }
    }

    meshRef.current!.instanceMatrix.needsUpdate = true;
  }, [
    tempObject,
    objects,
    activeShapes,
    colorArray,
    tempColor,
    aspect,
    hits,
    isPointerDown,
    springs,
  ]);

  return (
    // @ts-ignore
    <a.instancedMesh
      {...bind()}
      ref={meshRef}
      args={[undefined, undefined, objects.length]}
    >
      <boxBufferGeometry
        attach="geometry"
        args={[
          getSizeByAspect(0.7, aspect),
          getSizeByAspect(0.7, aspect),
          getSizeByAspect(0.2, aspect),
        ]}
      >
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colorArray, 3]}
        />
      </boxBufferGeometry>
      <meshStandardMaterial vertexColors />
    </a.instancedMesh>
  );
}
