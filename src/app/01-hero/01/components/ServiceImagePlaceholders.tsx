'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function ServiceImagePlaceholders() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const placeholders = [
    {
      id: 1,
      title: 'AI検索インターface',
      description: '自然言語でのデータ検索',
      position: { top: '10%', left: '20%' },
      size: { width: '280px', height: '180px' },
      delay: 0.2
    },
    {
      id: 2,
      title: '図面解析システム',
      description: 'AI による自動図面解析',
      position: { top: '35%', right: '10%' },
      size: { width: '320px', height: '200px' },
      delay: 0.4
    },
    {
      id: 3,
      title: 'データ統合ダッシュボード',
      description: '部門横断的なデータ可視化',
      position: { bottom: '25%', left: '15%' },
      size: { width: '300px', height: '190px' },
      delay: 0.6
    },
    {
      id: 4,
      title: 'システム連携画面',
      description: '既存システムとの シームレス連携',
      position: { bottom: '10%', right: '20%' },
      size: { width: '260px', height: '160px' },
      delay: 0.8
    }
  ]

  return (
    <div className="relative w-full h-[600px]">
      {placeholders.map((placeholder, index) => (
        <motion.div
          key={placeholder.id}
          className="absolute cursor-pointer group"
          style={{
            ...placeholder.position,
            width: placeholder.size.width,
            height: placeholder.size.height,
          }}
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: placeholder.delay,
            type: "spring",
            stiffness: 100
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          whileHover={{ 
            scale: 1.05, 
            rotateY: 5,
            z: 50
          }}
        >
          {/* メイン画像プレースホルダー */}
          <motion.div
            className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl shadow-lg overflow-hidden border border-gray-200"
            animate={{
              boxShadow: hoveredIndex === index 
                ? '0 20px 40px rgba(55, 183, 196, 0.3)' 
                : '0 10px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* ヘッダー部分 */}
            <div className="h-8 bg-gradient-to-r from-[#37B7C4] to-[#37B7C4]/80 flex items-center px-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </div>
            </div>

            {/* コンテンツエリア */}
            <div className="p-4 h-full bg-white relative">
              {/* ダミーコンテンツ要素 */}
              <motion.div 
                className="space-y-2"
                animate={{
                  opacity: hoveredIndex === index ? 0.3 : 0.6
                }}
              >
                <div className="h-3 bg-[#37B7C4]/20 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-8 bg-[#37B7C4]/10 rounded"></div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                </div>
                
                <div className="mt-4 h-16 bg-gradient-to-r from-[#37B7C4]/5 to-transparent rounded"></div>
              </motion.div>

              {/* ホバー時の詳細情報 */}
              <motion.div
                className="absolute inset-0 bg-white/95 flex flex-col justify-center items-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ pointerEvents: hoveredIndex === index ? 'auto' : 'none' }}
              >
                <motion.div
                  className="text-center"
                  initial={{ y: 10 }}
                  animate={{ y: hoveredIndex === index ? 0 : 10 }}
                >
                  <h3 className="text-lg font-semibold text-[#37B7C4] mb-2">
                    {placeholder.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {placeholder.description}
                  </p>
                  <motion.div
                    className="mt-4 px-4 py-2 bg-[#37B7C4] text-white rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    詳細を見る
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* 接続線効果 */}
          {hoveredIndex === index && (
            <motion.div
              className="absolute -inset-4 border-2 border-[#37B7C4]/30 rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      ))}

      {/* 背景の接続線 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#37B7C4" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#37B7C4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#37B7C4" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M 100 100 Q 300 200 500 150 T 400 400"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        
        <motion.path
          d="M 200 400 Q 150 250 400 200 T 350 100"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
      </svg>
    </div>
  )
}