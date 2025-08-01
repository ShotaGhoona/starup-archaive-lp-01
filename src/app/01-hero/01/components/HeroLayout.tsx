'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { HeroText } from './HeroText'
import { CentralDataSphere } from './CentralDataSphere'

export function HeroLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Three.js 背景 */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            {/* 中央データスフィア */}
            <CentralDataSphere />
            
            {/* 環境効果 */}
            <fog attach="fog" args={['#ffffff', 15, 25]} />
          </Suspense>
        </Canvas>
      </div>

      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

      {/* メインコンテンツ */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="w-full px-8 lg:px-16 xl:px-24">
          <div className="max-w-4xl">
            {/* テキストコンテンツ */}
            <div className="space-y-12">
              <HeroText />
              
              {/* CTA ボタン */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.button
                  className="px-10 py-5 bg-[#37B7C4] text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  DX専門家に相談する（無料）
                </motion.button>
                
                <motion.button
                  className="px-10 py-5 border-2 border-[#37B7C4] text-[#37B7C4] text-lg font-semibold rounded-lg hover:bg-[#37B7C4] hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  サービス詳細資料をダウンロード
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}