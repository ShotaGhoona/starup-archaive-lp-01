'use client'

import { motion } from 'framer-motion'

export function HeroText() {
  return (
    <div className="space-y-6">
      {/* メインヘッドライン */}
      <motion.h1 
        className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="text-gray-900">分断された</span>
        <motion.span 
          className="text-[#37B7C4]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          データと暗黙知を繋ぎ、
        </motion.span>
        <br />
        <motion.span 
          className="text-[#37B7C4]"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          ものづくりの「資産」
        </motion.span>
        <span className="text-gray-900">を築く。</span>
      </motion.h1>

      {/* サブヘッドライン */}
      <motion.div 
        className="space-y-6 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <p className="text-lg lg:text-xl text-gray-600 font-medium">
          単なる図面管理・検索ではない。
        </p>
        
        <motion.p 
          className="text-lg lg:text-xl text-gray-800 font-medium leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          図面起点で分断されたデータを繋ぎ、会社の<span className="text-[#37B7C4] font-semibold">「知の資産」</span>を未来へ引き継ぐ、<br />
          <span className="text-[#37B7C4] font-semibold">製造業のためのAI開発基盤</span>です。
        </motion.p>
      </motion.div>

    </div>
  )
}