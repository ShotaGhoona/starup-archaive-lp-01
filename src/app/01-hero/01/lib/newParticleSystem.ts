import * as THREE from 'three'

export interface NewParticleSystemConfig {
  particleCount: number
  compactRadius: number // 50vh 30vw相当のサイズ
  dispersalRadius: number // 画面を飛び出るサイズ
  animationSpeed: number
  color: string
  particleSize: number
}

export class NewParticleSystem {
  private geometry: THREE.BufferGeometry
  private material: THREE.PointsMaterial
  private points: THREE.Points
  private positions: Float32Array
  private originalPositions: Float32Array
  private dispersalPositions: Float32Array
  private sizes: Float32Array
  private config: NewParticleSystemConfig
  private animationPhase: number = 0
  private isForming: boolean = true

  constructor(config: NewParticleSystemConfig) {
    this.config = config
    this.geometry = new THREE.BufferGeometry()
    this.positions = new Float32Array(config.particleCount * 3)
    this.originalPositions = new Float32Array(config.particleCount * 3)
    this.dispersalPositions = new Float32Array(config.particleCount * 3)
    this.sizes = new Float32Array(config.particleCount)
    
    // 初期状態を分散状態に設定
    this.isForming = false

    this.initializeParticles()
    this.setupGeometry()
    this.setupMaterial()
    this.points = new THREE.Points(this.geometry, this.material)
  }

  private initializeParticles() {
    for (let i = 0; i < this.config.particleCount; i++) {
      // Fibonacci球面分布で球体形成時の位置を計算
      const phi = Math.acos(1 - 2 * (i + 0.5) / this.config.particleCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)

      const x = Math.sin(phi) * Math.cos(theta) * this.config.compactRadius
      const y = Math.sin(phi) * Math.sin(theta) * this.config.compactRadius
      const z = Math.cos(phi) * this.config.compactRadius

      // 球体形成時の位置
      this.originalPositions[i * 3] = x
      this.originalPositions[i * 3 + 1] = y
      this.originalPositions[i * 3 + 2] = z

      // 分散時の位置（画面を飛び出るくらい広範囲）
      const dispersalX = (Math.random() - 0.5) * this.config.dispersalRadius * 2
      const dispersalY = (Math.random() - 0.5) * this.config.dispersalRadius * 2
      const dispersalZ = (Math.random() - 0.5) * this.config.dispersalRadius * 2

      this.dispersalPositions[i * 3] = dispersalX
      this.dispersalPositions[i * 3 + 1] = dispersalY
      this.dispersalPositions[i * 3 + 2] = dispersalZ

      // 初期位置は分散状態からスタート
      this.positions[i * 3] = dispersalX
      this.positions[i * 3 + 1] = dispersalY
      this.positions[i * 3 + 2] = dispersalZ

      // パーティクルサイズ（遠近法用）
      this.sizes[i] = this.config.particleSize * (0.5 + Math.random() * 0.5)
    }
  }

  private setupGeometry() {
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1))
  }

  private setupMaterial() {
    this.material = new THREE.PointsMaterial({
      color: this.config.color,
      size: this.config.particleSize,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
  }

  public update(deltaTime: number) {
    this.animationPhase += deltaTime * this.config.animationSpeed
    
    // 6秒周期でよりダイナミックなアニメーション
    const cycle = (this.animationPhase % 6000) / 6000
    
    // 非対称なタイミング: 球体2秒、分敡4秒
    const formingDuration = 0.33 // 2秒 / 6秒
    this.isForming = cycle < formingDuration

    const progress = this.isForming 
      ? this.dramaticEaseIn((cycle / formingDuration))
      : 1 - this.explosiveEaseOut(((cycle - formingDuration) / (1 - formingDuration)))

    for (let i = 0; i < this.config.particleCount; i++) {
      const baseIndex = i * 3
      
      // 分散位置から球面位置への補間
      this.positions[baseIndex] = THREE.MathUtils.lerp(
        this.dispersalPositions[baseIndex], 
        this.originalPositions[baseIndex], 
        progress
      )
      this.positions[baseIndex + 1] = THREE.MathUtils.lerp(
        this.dispersalPositions[baseIndex + 1], 
        this.originalPositions[baseIndex + 1], 
        progress
      )
      this.positions[baseIndex + 2] = THREE.MathUtils.lerp(
        this.dispersalPositions[baseIndex + 2], 
        this.originalPositions[baseIndex + 2], 
        progress
      )

      // ダイナミックな揺らぎと速度変化
      const turbulence = this.isForming ? 0.01 : 0.05 * (1 - progress)
      const timeOffset = i * 0.1
      this.positions[baseIndex] += Math.sin(this.animationPhase * 0.002 + timeOffset) * turbulence
      this.positions[baseIndex + 1] += Math.cos(this.animationPhase * 0.002 + timeOffset) * turbulence
      this.positions[baseIndex + 2] += Math.sin(this.animationPhase * 0.001 + timeOffset) * turbulence * 0.5

      // 遠近法効果とアニメーション連動サイズ変化
      const distance = Math.sqrt(
        this.positions[baseIndex] ** 2 + 
        this.positions[baseIndex + 1] ** 2 + 
        this.positions[baseIndex + 2] ** 2
      )
      const baseSizeMultiplier = Math.max(0.2, 1 - (distance / this.config.dispersalRadius) * 0.8)
      
      // アニメーションに合わせたサイズ変化
      const animationSizeBoost = this.isForming ? 
        1 + Math.sin(progress * Math.PI) * 0.3 : // 球体形成時は大きく
        1 - progress * 0.4 // 分散時は小さく
      
      const randomVariation = 0.7 + Math.random() * 0.6
      this.sizes[i] = this.config.particleSize * baseSizeMultiplier * animationSizeBoost * randomVariation
    }

    // ダイナミックな透明度変化
    const baseOpacity = this.isForming ? 0.8 : 0.5
    const pulseOpacity = Math.sin(this.animationPhase * 0.003) * 0.2
    const progressOpacity = this.isForming ? progress * 0.3 : (1 - progress) * 0.4
    this.material.opacity = Math.min(1, baseOpacity + pulseOpacity + progressOpacity)

    this.geometry.attributes.position.needsUpdate = true
    this.geometry.attributes.size.needsUpdate = true
  }

  // ドラマチックな球体形成 - スロースタートから加速
  private dramaticEaseIn(t: number): number {
    return t < 0.7 ? 2 * t * t * t : 1 - Math.pow(-2 * (t - 0.7) / 0.3 + 2, 3) / 2
  }

  // 爆発的分散 - 急速な開始からスローダウン
  private explosiveEaseOut(t: number): number {
    if (t < 0.3) {
      // 最初の30%で爆登的に加速
      return 4 * t * t * t
    } else {
      // 残り70%で緩やかに減速
      const adjustedT = (t - 0.3) / 0.7
      return 0.108 + (1 - 0.108) * (1 - Math.pow(1 - adjustedT, 3))
    }
  }

  public getPoints(): THREE.Points {
    return this.points
  }

  public dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}