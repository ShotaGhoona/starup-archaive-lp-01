'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create abstract flowing network visualization
    const geometry = new THREE.BufferGeometry();
    const particles = 100;
    const positions = new Float32Array(particles * 3);
    
    for (let i = 0; i < particles * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x37B7C4,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Create connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    
    for (let i = 0; i < particles; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      
      // Connect to nearby points
      for (let j = i + 1; j < Math.min(i + 5, particles); j++) {
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];
        
        const distance = Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2 + (z2 - z) ** 2);
        if (distance < 2) {
          linePositions.push(x, y, z, x2, y2, z2);
        }
      }
    }
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x37B7C4,
      transparent: true,
      opacity: 0.3,
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      points.rotation.x += 0.002;
      points.rotation.y += 0.002;
      lines.rotation.x += 0.002;
      lines.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Three.js Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#333333] mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[#37B7C4]">分断されたデータと暗黙知を繋ぎ、</span>
            <br />
            <span>ものづくりの「資産」を築く。</span>
          </motion.h1>
          
          <motion.div
            className="text-lg sm:text-xl text-[#333333] mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="font-semibold mb-4">単なる図面管理・検索ではない。</p>
            <p>図面起点で分断されたデータを繋ぎ、会社の「知の資産」を未来へ引き継ぐ、<br />製造業のためのAI開発基盤です。</p>
          </div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="bg-[#37B7C4] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#2a9aa5] transition-colors duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              DX専門家に相談する（<span className="text-[#f54848]">無料</span>）
            </motion.button>
            
            <motion.button
              className="border-2 border-[#37B7C4] text-[#37B7C4] bg-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#37B7C4] hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              サービス詳細資料をダウンロード
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-[#37B7C4] rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-[#37B7C4] rounded-full mt-2"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;