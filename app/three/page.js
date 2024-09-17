'use client'
import { Canvas, useLoader } from "@react-three/fiber";
import { ArcadeCabinet } from "./arcade/page";
import { OrbitControls } from "@react-three/drei";

export default function Office() {
    return (
        <div className="h-screen w-screen">
            <Canvas
                shadows
                className="bg-white"
                camera={{
                    position: [7, 7, 7]
                }}
            >
                <ambientLight />
                <pointLight position={[7, 7, 7]}/>
                <OrbitControls />
                <ArcadeCabinet />
            </Canvas>
        </div>
    )
}