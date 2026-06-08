"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);

  return (
    <primitive
      object={scene}
      scale={2.5}
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
  );
}

export default function Book3D({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 2] }}>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} />

      <Model modelUrl={modelUrl} />

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
