'use client'
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import OfficeScene from "@/components/OfficeScene";
import { Suspense, useRef } from "react";

export default function Office() {
    const ref = useRef()
    return (
        <div className="h-screen w-screen">
            <Canvas
                shadows
                className="bg-white"
                dpr={[1, 2]} 
                camera={{ fov: 50 }}
            >
                <Suspense fallback={null}>
                    <Stage controls={ref} preset="rembrandt" intensity={1}  environment="city">
                        false
                        <OfficeScene />
                        false
                    </Stage>
                </Suspense>
                <OrbitControls ref={ref}/>
            </Canvas>
        </div>
    )
}         