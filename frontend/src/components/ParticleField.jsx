import React, { useMemo } from 'react'

// 小さいスプライトに使う画像（必要に応じて追加/差し替え可）
import homemax1 from '../assets/homemax_01-2.png'
import homemax2 from '../assets/homemax_03.png'
import gyaru1 from '../assets/gyarumax2.png'
import otaku1 from '../assets/otamax3.png'

const spritePool = [homemax1, homemax2, gyaru1, otaku1]

const ParticleField = () => {
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches
  const count = isMobile ? 16 : 32

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100               // 0〜100vw
      const size = 12 + Math.random() * 20           // 12〜32px
      const duration = 14 + Math.random() * 18       // 14〜32s
      const delay = -Math.random() * 20              // ループずらし
      const rot = (Math.random() * 30 - 15).toFixed(1) // -15〜15deg
      const drift = (Math.random() * 40 - 20).toFixed(0) // x方向ドリフト(px)
      const img = spritePool[Math.floor(Math.random() * spritePool.length)]
      return { id: i, left, size, duration, delay, rot, drift, img }
    })
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <img
          key={p.id}
          src={p.img}
          alt=""
          className="particle"
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '100vh',                  // 画面下からスタート
            width: `${p.size}px`,
            height: 'auto',
            opacity: 0.5,
            animation: `particle-rise ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            // カスタムプロパティで回転とxドリフトを渡す
            '--rot': `${p.rot}deg`,
            '--driftX': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

export default ParticleField