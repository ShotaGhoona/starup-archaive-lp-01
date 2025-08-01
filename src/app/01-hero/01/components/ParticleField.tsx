'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField() {
  const meshRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    const color = new THREE.Color('#37B7C4')
    
    for (let i = 0; i < count; i++) {
      // 位置をランダムに設定（広範囲に散布）
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      // 色設定
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      // サイズをランダムに設定
      sizes[i] = Math.random() * 0.03 + 0.005
    }
    
    return { positions, colors, sizes, count }
  }, [])

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3))
    geom.setAttribute('size', new THREE.BufferAttribute(particles.sizes, 1))
    return geom
  }, [particles])

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.01,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      // ゆっくりとした回転
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.01
      
      // パーティクルの透明度を変動させる
      material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <points ref={meshRef} geometry={geometry} material={material} />
  )
}