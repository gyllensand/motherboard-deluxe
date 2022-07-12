import { MutableRefObject } from "react";
import { a, SpringValue } from "@react-spring/three";
import { PointLight } from "three";
import { getSizeByAspect } from "./utils";

const Lights = ({
  aspect,
  flashLightRef,
  lightSpring,
  mainTheme,
  flashLightColor,
}: {
  aspect: number;
  mainTheme: string;
  flashLightColor: string;
  flashLightRef: MutableRefObject<PointLight | undefined>;
  lightSpring: {
    flashLight: SpringValue<number>;
    roomLight: SpringValue<number>;
    ambientLight: SpringValue<number>;
  };
}) => {
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
        color={mainTheme}
        intensity={lightSpring.roomLight}
      />

      {/* // @ts-ignore
       */}
      <a.pointLight
        ref={flashLightRef}
        position={[0, 0, -1]}
        color={flashLightColor}
        intensity={lightSpring.flashLight}
        decay={2}
        distance={2}
      />
    </group>
  );
};

export default Lights;
