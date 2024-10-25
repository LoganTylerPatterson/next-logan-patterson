'use client'
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { getFunction, getFunctionIndex, multiwave, ripple, wave } from './FunctionLibrary'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import pointFragmentShader from './fragment.glsl'
import pointVertexShader from './vertex.glsl'

const PointMaterial = shaderMaterial(
    {
        uTime: 0,
        uGraphType: 0
    },
    pointVertexShader,
    pointFragmentShader,
)

extend({ PointMaterial })

export default function Graph(props) {
    const resolution = props.resolution
    const graphType = props.graphType

    const positions = new Float32Array(resolution * resolution * 3)
    let step = 2 / resolution
    for (let i = 0, x = 0, z = 0; i < resolution * resolution; i++, x++) {
        if (x == resolution) {
            x = 0;
            z += 1;
        }
        const i3 = i * 3

        const fun = getFunction(graphType)
        //Calculate x position
        positions[i3] = ((x + 0.5) * step - 1)
        //Calculate y position
        positions[i3 + 1] = fun(positions[i3], 0, 0)
        //Calculate z position
        positions[i3 + 2] = ((z + 0.5) * step - 1)

    }

    const pointMaterial = useRef()
    useFrame((state, delta) => {
        pointMaterial.current.uTime += delta
        pointMaterial.current.uGraphType = getFunctionIndex(graphType)
    })

    return <>
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={resolution * resolution}
                    itemSize={3}
                    array={positions}
                />
            </bufferGeometry>
            <pointMaterial
                ref={pointMaterial}
                depthWrite={true}
                vertexColors={true}
                transparent={false}
            />
        </points>
    </>
}