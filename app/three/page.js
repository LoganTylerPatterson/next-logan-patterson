'use client'
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import OfficeScene from "@/components/OfficeScene";

export default function Office() {
    return (
        <div className="h-screen w-screen">
            <Canvas
                shadows
                className="bg-black"
                camera={{
                    position: [7, 7, 7]
                }}
            >
                <ambientLight />
                <pointLight position={[7, 7, 7]}/>
                <directionalLight/>
                <OrbitControls />
                <OfficeScene />
            </Canvas>
        </div>
    )
}         