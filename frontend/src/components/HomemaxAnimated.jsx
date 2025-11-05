import React, { useState, useEffect } from 'react'
import homemaxImg1 from '../assets/homemax_01-2.png'
import homemaxImg2 from '../assets/homemax_02.png'
import homemaxImg3 from '../assets/homemax_03.png'
import homemaxImg4 from '../assets/homemax_04.png'
import homemaxImg5 from '../assets/homemax_05.png'
import homemaxImg6 from '../assets/homemax_06.png'
import homemaxImg7 from '../assets/homemax_07.png'
import gyarumax1 from '../assets/gyarumax1.png'
import gyarumax2 from '../assets/gyarumax2.png'
import gyarumax3 from '../assets/gyarumax3.png'
import gyarumax4 from '../assets/gyarumax4.png'
import gyarumax5 from '../assets/gyarumax5.png'
import gyarumax6 from '../assets/gyarumax6.png'
import otamax1 from '../assets/otamax1.png'
import otamax2 from '../assets/otamax2.png'
import otamax3 from '../assets/otamax3.png'
import otamax4 from '../assets/otamax4.png'
import otamax5 from '../assets/otamax5.png'
import otamax6 from '../assets/otamax6.png'
import yamimax1 from '../assets/yamimax1.png'
import yamimax2 from '../assets/yamimax2.png'
import yamimax3 from '../assets/yamimax3.png'
import yamimax4 from '../assets/yamimax4.png'
import yamimax5 from '../assets/yamimax5.png'
import yamimax6 from '../assets/yamimax6.png'


const HomemaxAnimated = ({ isLoading, mode }) => {
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
    gyarumax1,
    gyarumax2,
    gyarumax3,
    gyarumax4,
    gyarumax5,
    gyarumax6,
    otamax1,
    otamax2,
    otamax3,
    otamax4,
    otamax5,
    otamax6,
    yamimax1,
    yamimax2,
    yamimax3,
    yamimax4,
    yamimax5,
    yamimax6,
  ]

  // モードをキーに正規化
  const resolveModeKey = (m) => {
    if (!m || m === 'ほめマックス') return 'homemax'
    if (m.startsWith('ギャルです。')) return 'gyaru'
    if (m.startsWith('病んでる人です。')) return 'yami'
    if (m.startsWith('オタクです。')) return 'otaku'
    return 'homemax'
  }

  const modeImageRange = {
    homemax: { start: 0, end: 6, default: 0 },      // homemax_01-2 ~ homemax_07 (7枚)
    gyaru: { start: 7, end: 12, default: 7 },       // gyarumax1 ~ gyarumax6 (6枚)
    otaku: { start: 13, end: 18, default: 13 },     // otamax1 ~ otamax6 (6枚)
    yami: { start: 19, end: 24, default: 19 },      // yamimax1 ~ yamimax6 (6枚)
  }

  // モード変更時に固定画像へ
  useEffect(() => {
    if (isLoading) return
    const key = resolveModeKey(mode)
    // if (key === 'homemax') return
    const range = modeImageRange[key]
    if (range) {
      setCurrentImage(range.default)
    }
  }, [mode, isLoading]) // モードが変わった時にだけ反映

  useEffect(() => {
    if (!isLoading) return
    const key = resolveModeKey(mode)
    const range = modeImageRange[key]
    const interval = setInterval(() => {
      if (range) {
        const next = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start
        setCurrentImage(next)
      } else {
        setCurrentImage(prev => (prev + 1) % images.length)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [isLoading, mode])

  // なでる機能
  const handlePet = () => {
    setPetCount(prev => prev + 1)
    setShowSparkles(true)
    setTimeout(() => setShowSparkles(false), 1000)

    const key = resolveModeKey(mode)
    const range = modeImageRange[key]
    
    if (range) {
      // 指定範囲内でランダムに選択（start <= index <= end）
      const randomIndex = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start
      setCurrentImage(randomIndex)
    } else {
      // フォールバック: 全体からランダム
      setCurrentImage(Math.floor(Math.random() * images.length))
    }
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