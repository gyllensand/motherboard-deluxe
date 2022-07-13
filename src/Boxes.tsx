import { useMemo, useRef, useEffect, useState } from "react";
import { a } from "@react-spring/three";
import { Color, Object3D, InstancedMesh } from "three";
import { SHAPE_TYPES } from "./constants";
import { Object, width } from "./Scene";
import { useSprings } from "react-spring";
import { useGesture } from "react-use-gesture";
import { getSizeByAspect, minMaxNumber } from "./utils";
import { Sample } from "./App";

const DOUBLE_SIZE = 2.43;

interface ActiveShape {
  index: number;
  shape: number;
}

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

  let i = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      let innerId = i;
      const matchingId = activeShapes?.find(({ index }) => index === innerId);

      if (
        !activeShapes ||
        matchingId === undefined ||
        objects[i].shape === SHAPE_TYPES.FILLED_TILTED_SQUARE
      ) {
        i++;
        continue;
      }

      if (objects[matchingId.index].shape === SHAPE_TYPES.FILLED_SQUARE_LARGE) {
        tempObject.position.set(
          getSizeByAspect(x + 0.5, aspect),
          getSizeByAspect(y - 0.5, aspect),
          0
        );

        const activeScale =
          activeShapes.length > 1
            ? DOUBLE_SIZE * minMaxNumber(scale / 1.08, 1, 2)
            : DOUBLE_SIZE * scale;

        tempObject.scale.set(activeScale, activeScale, 1.01);
        tempObject.rotation.set(0, 0, 0);
      } else if (
        objects[matchingId.index].shape === SHAPE_TYPES.HOR_RECTANGLE
      ) {
        tempObject.position.set(
          getSizeByAspect(x + 0.5, aspect),
          getSizeByAspect(y, aspect),
          0
        );

        const activeScale =
          activeShapes.length > 1
            ? DOUBLE_SIZE * minMaxNumber(scale / 1.1, 1, 2)
            : DOUBLE_SIZE * scale;

        tempObject.scale.set(activeScale, 1 * scale, 1);
        tempObject.rotation.set(0, 0, 0);
      } else if (
        objects[matchingId.index].shape === SHAPE_TYPES.VER_RECTANGLE
      ) {
        tempObject.position.set(
          getSizeByAspect(x, aspect),
          getSizeByAspect(y - 0.5, aspect),
          0
        );

        const activeScale =
          activeShapes.length > 1
            ? DOUBLE_SIZE * minMaxNumber(scale / 1.1, 1, 2)
            : DOUBLE_SIZE * scale;

        tempObject.scale.set(1 * scale, activeScale, 1);
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

      tempObject.updateMatrix();
      mesh.setMatrixAt(matchingId.index, tempObject.matrix);
      mesh.instanceMatrix.needsUpdate = true;

      i++;
    }
  }
}

export const getIntersectingIndexesFromId = (
  id: number,
  objects: Object[]
): ActiveShape[] => {
  const mainCoveringIndexes = objects[id].coveringIndexes;
  let sum: { index: number; coveringIndexes: number[] }[] = [
    { index: id, coveringIndexes: mainCoveringIndexes },
  ];

  const iterateCoverIndexes = () => {
    for (let i = 0; i < objects.length; i++) {
      const match = objects[i].coveringIndexes.filter(
        (a) => sum.find((b) => b.coveringIndexes.indexOf(a) >= 0) !== undefined
      );

      const alreadyExists = sum.find((o) => o.index === i) !== undefined;

      if (
        match.length &&
        objects[i].shape !== SHAPE_TYPES.EMPTY &&
        !alreadyExists
      ) {
        sum.push({ index: i, coveringIndexes: objects[i].coveringIndexes });
        iterateCoverIndexes();
        break;
      }
    }
  };

  iterateCoverIndexes();

  const intersectedShapes = sum.map((o) => ({
    index: o.index,
    shape: objects[o.index].shape,
  }));

  return intersectedShapes;
};

const Boxes = ({
  objects,
  aspect,
  isPointerDown,
  isPointerOnBg,
  hits,
  toneInitialized,
}: {
  objects: Object[];
  aspect: number;
  isPointerDown: boolean;
  isPointerOnBg: boolean;
  hits?: Sample[][];
  toneInitialized: boolean;
}) => {
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

  const [springs] = useSprings(objects.length, (i) => ({
    scale: 1,
    config: {
      mass: 5,
      tension: 1000,
      friction: 50,
      precision: 0.0001,
      clamp: true,
    },
  }));

  const prevPointerOut = useRef<ActiveShape[] | undefined>([]);

  useEffect(() => {
    if (isPointerOnBg) {
      prevPointerOut.current = undefined;
    }
  }, [isPointerOnBg]);

  useEffect(() => {
    if (!isPointerDown) {
      setActiveShapes(undefined);
    }
  }, [isPointerDown]);

  const bind = useGesture({
    onPointerOver: (e) => {
      e.event.stopPropagation();

      // @ts-ignore
      const id = e.event.instanceId;
      const intersectedIds = getIntersectingIndexesFromId(id, objects);

      if (!prevPointerOut.current) {
        setActiveShapes([...intersectedIds]);
      }
    },
    onPointerOut: (e) => {
      e.event.stopPropagation();

      // @ts-ignore
      const id = e.event.instanceId;
      const intersectedIds = getIntersectingIndexesFromId(id, objects);
      prevPointerOut.current = intersectedIds;
      setActiveShapes(undefined);
    },
    onPointerDown: (e) => {
      // @ts-ignore
      const id = e.event.instanceId;
      const intersectedIds = getIntersectingIndexesFromId(id, objects);
      setActiveShapes([...intersectedIds]);
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
    let combinedHits = [];

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
          tempObject.scale.set(DOUBLE_SIZE, DOUBLE_SIZE, 1.01);
          tempObject.rotation.set(0, 0, 0);
        } else if (objects[i].shape === SHAPE_TYPES.HOR_RECTANGLE) {
          tempObject.position.set(
            getSizeByAspect(x + 0.5, aspect),
            getSizeByAspect(y, aspect),
            0
          );
          tempObject.scale.set(DOUBLE_SIZE, 1, 1);
          tempObject.rotation.set(0, 0, 0);
        } else if (objects[i].shape === SHAPE_TYPES.VER_RECTANGLE) {
          tempObject.position.set(
            getSizeByAspect(x, aspect),
            getSizeByAspect(y - 0.5, aspect),
            0
          );
          tempObject.scale.set(1, DOUBLE_SIZE, 1);
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

        const id = i;

        if (
          !!activeShapes?.find(
            (active) => active.shape !== SHAPE_TYPES.FILLED_TILTED_SQUARE
          ) &&
          !!activeShapes?.find((active) => id === active.index) &&
          hits &&
          isPointerDown
        ) {
          const currentHits = hits[id].reduce<Sample[]>((hitsArray, hit, i) => {
            if (hitsArray.find((o) => o.index === hit.index) === undefined) {
              hitsArray.push(hit);
            }

            return hitsArray;
          }, []);

          combinedHits.push([...currentHits]);
        }

        i++;

        tempObject.updateMatrix();
        meshRef.current!.geometry.attributes.color.needsUpdate = true;
        meshRef.current!.setMatrixAt(id, tempObject.matrix);
      }
    }

    const filteredSingleHits = combinedHits
      .flat()
      .reduce<Sample[]>((arr, item) => {
        const alreadyHasBass = arr.find((o) => o.index >= 100) !== undefined;

        if (item.index >= 100 && alreadyHasBass) {
          return arr;
        }

        if (arr.find((o) => o.index === item.index) === undefined) {
          arr.push(item);
        }

        return arr;
      }, []);

      if(toneInitialized) {
        filteredSingleHits.forEach((hit) => {
          hit.sampler.triggerAttack("C#-1");
        });
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
    toneInitialized,
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
};

export default Boxes;
