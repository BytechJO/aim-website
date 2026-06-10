"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds, Center } from "@react-three/drei";
import { Suspense, useEffect } from "react";

function Model({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);

  return (
    <Center>
      <primitive
        object={scene}
        onPointerOver={() => {
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        onPointerDown={() => {
          document.body.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          document.body.style.cursor = "grab";
        }}
      />
    </Center>
  );
}

export default function Book3D({ modelUrl }: { modelUrl: string }) {
  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
        <ambientLight intensity={2} />
        <directionalLight position={[5, 5, 5]} intensity={2} />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Model modelUrl={modelUrl} />
          </Bounds>
        </Suspense>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
