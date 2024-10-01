/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
'use client'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function ArcadeCabinet(props) {
  const { nodes, materials } = useGLTF('/models/arcade_machine.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Arcade_Cabinet.geometry}
        material={materials.ArcadeMaterial}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Bolt010.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.463, 6.012, -1.496]}
          rotation={[Math.PI / 2, 0, 1.562]}
          scale={0.108}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder011.geometry}
          material={materials.ArcadeMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder012.geometry}
          material={materials.ArcadeMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder020.geometry}
          material={materials.ArcadeMaterial}
          position={[0, 2.869, -0.357]}
          rotation={[0, -1.562, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder029.geometry}
          material={materials.ArcadeMaterial}
          position={[0, 2.869, -0.357]}
          rotation={[0, -1.562, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder042.geometry}
          material={materials.ArcadeMaterial}
          position={[0, 2.869, -0.357]}
          rotation={[0, -1.562, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text.geometry}
          material={materials.ArcadeMaterial}
          position={[1.074, 5.687, -1.553]}
          rotation={[Math.PI / 2, 0, 3.133]}
          scale={[0.445, 0.445, 0.378]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text002.geometry}
          material={materials.ArcadeMaterial}
          position={[1.047, 5.93, -1.576]}
          rotation={[Math.PI / 2, 0, 3.133]}
          scale={[0.095, 0.095, 0.08]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text003.geometry}
          material={materials.ArcadeMaterial}
          position={[-0.506, 5.615, -1.553]}
          rotation={[Math.PI / 2, 0, 3.133]}
          scale={[0.095, 0.095, 0.08]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text004.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.505, 1.343, -0.604]}
          rotation={[0.893, 0.005, 1.564]}
          scale={[0.195, 0.195, 0.166]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text005.geometry}
          material={materials.ArcadeMaterial}
          position={[1.485, 2.326, 0.568]}
          rotation={[0.915, 0.005, -1.578]}
          scale={[0.195, 0.195, 0.166]}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ArcadeScreen.geometry}
        material={materials.ArcadeMaterial}
        position={[0, 2.869, -0.357]}
        rotation={[0, -1.562, 0]}
        scale={[0.855, 2.757, 1.387]}
      />
    </group>
  )
}

useGLTF.preload('/models/arcade_machine.glb')