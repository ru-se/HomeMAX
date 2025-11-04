import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast, Slide } from 'react-toastify'
import homeImage from '../assets/homemax_01-2.png'
import '../styles/Start.css';

const Start = () => {
  const navigate = useNavigate()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true
    
    ;(async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ task_title: "起床" }),
        })
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ task_title: "パソコン開く" }),
        })
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ task_title: "パソコン画面開く" }),
        })
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ task_title: "アプリ起動" }),
        })
      } catch (e) {}
    })()
  }, [])

  return (
    <div className="h-screen w-screen overflow-hidden bg- flex items-center justify-center relative ">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={3}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />

      {/* 背景アニメーション - 横スクロールするほめマックス */}
      <div className="absolute inset-0 overflow-hidden opacity-50">
        <div className="animate-marquee-right whitespace-nowrap flex h-1/2">
          {[...Array(20)].map((_, i) => (
            <img 
              key={i} 
              src={homeImage} 
              alt="" 
              className="inline-block h-32 mx-8"
            />
          ))}
        </div>
        <div className="animate-marquee-left whitespace-nowrap flex items-end h-1/2">
          {[...Array(20)].map((_, i) => (
            <img 
              key={i} 
              src={homeImage} 
              alt="" 
              className="inline-block h-32 mx-8"
            />
          ))}
          </div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 text-center">
        {/* タイトル */}
        <h1 className="text-9xl font-black mb-8 animate-bounce-in">
          <span className="bg-gradient-to-r max-w-48 bg-clip-text text-Rose drop-shadow-2xl homemax-text start-red">
            ほめマックス！
          </span>
        </h1>

        {/* 簡単な説明 */}
        <p className="text-3xl font-bold text-gray-700 mb-12 font-kiwi-maru">
          あなたの"がんばり"を<span className="start-red">全力</span>で褒めちぎる！
        </p>

        {/* スタートボタン */}
        <button
          onClick={() => navigate('/home')}
          className=" relative px-20 py-8 bg-gradient-to-r start-yellow rounded-full text-4xl font-black transform transition-all hover:scale-110 hover:shadow-3xl">
          <span className="relative z-10 start-red font-kiwi-maru">はじめる！</span>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <div className="absolute inset-0 rounded-full animate-pulse-glow"></div>
        </button>
      </div>
    </div>
  )
}

export default Start