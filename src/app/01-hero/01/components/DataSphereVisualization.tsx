'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { ParticleSystem, ParticleSystemConfig } from '../lib/particleSystem'
import * as THREE from 'three'

interface DataSphereProps {
  position?: [number, number, number]
  scale?: number
}

export function DataSphereVisualization({ position = [0, 0, 0], scale = 1 }: DataSphereProps) {
  const groupRef = useRef<THREE.Group>(null)
  const particleSystemRef = useRef<ParticleSystem | null>(null)
  const clockRef = useRef(0)

  const config: ParticleSystemConfig = useMemo(() => ({
    particleCount: 1200,
    sphereRadius: 1.5 * scale,
    dispersalRadius: 3 * scale,
    animationSpeed: 1,
    color: '#37B7C4'
  }), [scale])

  useEffect(() => {
    if (!particleSystemRef.current) {
      particleSystemRef.current = new ParticleSystem(config)
      if (groupRef.current) {
        groupRef.current.add(particleSystemRef.current.getPoints())
      }
    }

    return () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose()
        particleSystemRef.current = null
      }
    }
  }, [config])

  useFrame((state, delta) => {
    clockRef.current += delta * 1000
    
    if (particleSystemRef.current) {
      particleSystemRef.current.update(clockRef.current)
    }

    if (groupRef.current) {
      // ゆっくりとした回転
      groupRef.current.rotation.y += delta * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      
      // 微細な浮遊感
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* 環境光 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#37B7C4" />
      
      {/* コアスフィア - 中心に薄く光る球体 */}
      <mesh>
        <sphereGeometry args={[0.8 * scale, 32, 32]} />
        <meshBasicMaterial 
          color="#37B7C4" 
          transparent 
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* インナーグロー */}
      <mesh>
        <sphereGeometry args={[1.2 * scale, 16, 16]} />
        <meshBasicMaterial 
          color="#37B7C4" 
          transparent 
          opacity={0.02}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// データ接続線のコンポーネント
export function DataConnections() {
  const linesRef = useRef<THREE.Group>(null)

  const connections = useMemo(() => {
    const lines = []
    const connectionCount = 8
    
    for (let i = 0; i < connectionCount; i++) {
      const angle1 = (i / connectionCount) * Math.PI * 2
      const angle2 = ((i + 2) / connectionCount) * Math.PI * 2
      
      const start = new THREE.Vector3(
        Math.cos(angle1) * 2,
        Math.sin(angle1) * 2,
        (Math.random() - 0.5) * 1
      )
      
      const end = new THREE.Vector3(
        Math.cos(angle2) * 2,
        Math.sin(angle2) * 2,
        (Math.random() - 0.5) * 1
      )
      
      lines.push({ start, end, delay: i * 0.2 })
    }
    
    return lines
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((line, index) => {
        const material = (line as THREE.Line).material as THREE.LineBasicMaterial
        const phase = (state.clock.elapsedTime + connections[index].delay) * 2
        material.opacity = 0.3 + Math.sin(phase) * 0.2
      })
    }
  })

  return (
    <group ref={linesRef}>
      {connections.map((connection, index) => {
        const points = []
        points.push(connection.start)
        points.push(connection.end)
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        
        return (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial 
              color="#37B7C4" 
              transparent 
              opacity={0.3}
            />
          </line>
        )
      })}
    </group>
  )
}