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
        material={materials.ArcadeMaterial}
        position={[0, 2.869, -0.357]}
        rotation={[0, -1.562, 0]}
        scale={[0.855, 2.757, 1.387]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Bolt010.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.347, 1.14, 1.048]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[0.126, 0.078, 0.039]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder011.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.663, -0.034, -0.54]}
          scale={[0.083, 0.006, 0.051]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder012.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.663, -0.034, -0.415]}
          scale={[0.083, 0.006, 0.051]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder020.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.196, -0.028, 0.436]}
          rotation={[-0.023, 0.053, 0.141]}
          scale={[0.064, 0.011, 0.039]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder029.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.666, -0.028, 0.831]}
          rotation={[-0.023, 0.053, 0.141]}
          scale={[0.064, 0.011, 0.039]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder042.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.558, -0.026, -0.742]}
          scale={[0.07, 0.005, 0.043]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.389, 1.022, -0.782]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          scale={[0.321, 0.521, 0.137]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text002.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.416, 1.11, -0.762]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          scale={[0.068, 0.111, 0.029]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text003.geometry}
          material={materials.ArcadeMaterial}
          position={[-1.404, 0.996, 0.357]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          scale={[0.068, 0.111, 0.029]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text004.geometry}
          material={materials.ArcadeMaterial}
          position={[-0.303, -0.554, 1.084]}
          rotation={[1.326, 0.709, -0.318]}
          scale={[0.183, 0.141, 0.13]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text005.geometry}
          material={materials.ArcadeMaterial}
          position={[1.097, -0.197, -1.065]}
          rotation={[1.335, 0.697, 2.818]}
          scale={[0.186, 0.141, 0.127]}
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

useGLTF.preload('/arcade_machine.glb')