import React, { useState, useEffect } from 'react'
import homemaxImg1 from '../assets/homemax_01-2.png'
import homemaxImg2 from '../assets/homemax_02.png'
import homemaxImg3 from '../assets/homemax_03.png'
import homemaxImg4 from '../assets/homemax_04.png'
import homemaxImg5 from '../assets/homemax_05.png'
import homemaxImg6 from '../assets/homemax_06.png'
import homemaxImg7 from '../assets/homemax_07.png'

const HomemaxAnimated = ({ isLoading }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [petCount, setPetCount] = useState(0)
  const [showSparkles, setShowSparkles] = useState(false)

  const images = [
    homemaxImg1,
    homemaxImg2,
    homemaxImg3,
    homemaxImg4,
    homemaxImg5,
    homemaxImg6,
    homemaxImg7,
  ]

  // ローディング中のアニメーション
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % images.length)
      }, 200)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  // なでる機能
  const handlePet = () => {
    setPetCount(prev => prev + 1)
    setShowSparkles(true)
    setTimeout(() => setShowSparkles(false), 1000)

    // ランダムに画像を変える
    setCurrentImage(Math.floor(Math.random() * images.length))
  }

  return (
    <div className="relative">

       {/* なでた回数表示 */}
      {petCount > 0 && (
        <div className="absolute  left-1/2 transform -translate-x-1/2 bg-white/90 text-[#9C6924] px-6 py-2 rounded-full shadow-lg">
          <p className="text-sm font-bold">なでなで {petCount}回 💕</p>
        </div>
      )}

      {/* キャラクター本体 */}
      <div 
        className={`
          relative transition-transform duration-300 cursor-pointer
          ${isLoading ? 'animate-bounce' : 'hover:scale-105'}
        `}
        onClick={handlePet}
        onMouseEnter={handlePet}
      >
        <img 
          src={images[currentImage]} 
          alt="ほめマックス" 
          className="w-full max-w-md drop-shadow-2xl"
        />
        
        {/* キラキラエフェクト */}
        {showSparkles && (
          <>
            <div className="absolute top-0 left-0 text-6xl animate-ping">✨</div>
            <div className="absolute top-10 right-10 text-6xl animate-ping" style={{animationDelay: '0.1s'}}>⭐</div>
            <div className="absolute bottom-20 left-20 text-6xl animate-ping" style={{animationDelay: '0.2s'}}>💖</div>
          </>
        )}
      </div>

      {/* なでた回数表示 */}
      {/* {petCount > 0 && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 text-[#9C6924] px-6 py-2 rounded-full shadow-lg">
          <p className="text-sm font-bold">なでなで {petCount}回 💕</p>
        </div>
      )} */}

      {/* ローディング時のメッセージ */}
      {/* {isLoading && (
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-8 py-4 rounded-full shadow-xl border-2 border-pink-300">
          <p className="text-lg font-bold text-pink-600 whitespace-nowrap">
            一生懸命考え中... 🤔💭
          </p>
        </div>
      )} */}
    </div>
  )
}

export default HomemaxAnimated