import { useMemo, useRef, useEffect } from "react";
import { a } from "@react-spring/three";
import { Color, Object3D, InstancedMesh } from "three";
import { SHAPE_TYPES } from "./constants";
import { Object, width } from "./Scene";
import { useFrame } from "@react-three/fiber";
import {
  easeInOutSine,
  getSizeByAspect,
  minMaxNumber,
  pickRandomDecimalFromInterval,
} from "./utils";

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
