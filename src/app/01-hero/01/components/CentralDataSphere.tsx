'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { NewParticleSystem, NewParticleSystemConfig } from '../lib/newParticleSystem'
import * as THREE from 'three'

export function CentralDataSphere() {
  const groupRef = useRef<THREE.Group>(null)
  const particleSystemRef = useRef<NewParticleSystem | null>(null)
  const clockRef = useRef(0)
  const { viewport } = useThree()

  const config: NewParticleSystemConfig = useMemo(() => {
    // 50vh 30vw相当のサイズを3D空間のサイズに変換
    const compactRadius = Math.min(viewport.width * 0.15, viewport.height * 0.25)
    const dispersalRadius = Math.max(viewport.width * 1.5, viewport.height * 1.5)
    
    return {
      particleCount: 400,
      compactRadius,
      dispersalRadius,
      animationSpeed: 1,
      color: '#37B7C4',
      particleSize: 0.06 // 3倍サイズ
    }
  }, [viewport])

  useEffect(() => {
    if (!particleSystemRef.current) {
      particleSystemRef.current = new NewParticleSystem(config)
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
      // 非常にゆっくりとした回転
      groupRef.current.rotation.y += delta * 0.05
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
      
      // 微細な浮遊感
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[viewport.width * 0.1, 0, 0]}>
      {/* 環境光 */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#37B7C4" />
    </group>
  )
}