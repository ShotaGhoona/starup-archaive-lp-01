import * as THREE from 'three'

export interface ParticleSystemConfig {
  particleCount: number
  sphereRadius: number
  dispersalRadius: number
  animationSpeed: number
  color: string
}

export class ParticleSystem {
  private geometry: THREE.BufferGeometry
  private material: THREE.PointsMaterial
  private points: THREE.Points
  private positions: Float32Array
  private originalPositions: Float32Array
  private velocities: Float32Array
  private config: ParticleSystemConfig
  private animationPhase: number = 0
  private isForming: boolean = true

  constructor(config: ParticleSystemConfig) {
    this.config = config
    this.geometry = new THREE.BufferGeometry()
    this.positions = new Float32Array(config.particleCount * 3)
    this.originalPositions = new Float32Array(config.particleCount * 3)
    this.velocities = new Float32Array(config.particleCount * 3)

    this.initializeParticles()
    this.setupGeometry()
    this.setupMaterial()
    this.points = new THREE.Points(this.geometry, this.material)
  }

  private initializeParticles() {
    for (let i = 0; i < this.config.particleCount; i++) {
      // 球面上の均等分布を生成（Fibonacci sphere）
      const phi = Math.acos(1 - 2 * (i + 0.5) / this.config.particleCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)

      const x = Math.sin(phi) * Math.cos(theta) * this.config.sphereRadius
      const y = Math.sin(phi) * Math.sin(theta) * this.config.sphereRadius
      const z = Math.cos(phi) * this.config.sphereRadius

      // 球面上の位置を保存
      this.originalPositions[i * 3] = x
      this.originalPositions[i * 3 + 1] = y
      this.originalPositions[i * 3 + 2] = z

      // 初期位置は分散状態
      const dispersalX = (Math.random() - 0.5) * this.config.dispersalRadius * 2
      const dispersalY = (Math.random() - 0.5) * this.config.dispersalRadius * 2
      const dispersalZ = (Math.random() - 0.5) * this.config.dispersalRadius * 2

      this.positions[i * 3] = dispersalX
      this.positions[i * 3 + 1] = dispersalY
      this.positions[i * 3 + 2] = dispersalZ

      // 初期速度
      this.velocities[i * 3] = (Math.random() - 0.5) * 0.02
      this.velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }
  }

  private setupGeometry() {
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
  }

  private setupMaterial() {
    this.material = new THREE.PointsMaterial({
      color: this.config.color,
      size: 0.02,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    })
  }

  public update(deltaTime: number) {
    this.animationPhase += deltaTime * this.config.animationSpeed
    
    // 6秒周期でフォーメーションと分散を繰り返す
    const cycle = (this.animationPhase % 6000) / 6000
    this.isForming = cycle < 0.5

    const progress = this.isForming 
      ? this.easeInOutCubic((cycle % 0.5) * 2)
      : 1 - this.easeInOutCubic(((cycle - 0.5) % 0.5) * 2)

    for (let i = 0; i < this.config.particleCount; i++) {
      const baseIndex = i * 3
      
      // 分散位置から球面位置への補間
      const dispersalX = (Math.random() - 0.5) * this.config.dispersalRadius * 2
      const dispersalY = (Math.random() - 0.5) * this.config.dispersalRadius * 2
      const dispersalZ = (Math.random() - 0.5) * this.config.dispersalRadius * 2

      // 現在の位置を更新
      this.positions[baseIndex] = THREE.MathUtils.lerp(
        dispersalX, 
        this.originalPositions[baseIndex], 
        progress
      )
      this.positions[baseIndex + 1] = THREE.MathUtils.lerp(
        dispersalY, 
        this.originalPositions[baseIndex + 1], 
        progress
      )
      this.positions[baseIndex + 2] = THREE.MathUtils.lerp(
        dispersalZ, 
        this.originalPositions[baseIndex + 2], 
        progress
      )

      // 微細な揺らぎを追加
      this.positions[baseIndex] += Math.sin(this.animationPhase * 0.001 + i * 0.1) * 0.01
      this.positions[baseIndex + 1] += Math.cos(this.animationPhase * 0.001 + i * 0.1) * 0.01
    }

    // 透明度をアニメーション
    this.material.opacity = 0.6 + Math.sin(this.animationPhase * 0.002) * 0.2

    this.geometry.attributes.position.needsUpdate = true
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  public getPoints(): THREE.Points {
    return this.points
  }

  public dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}