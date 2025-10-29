import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHome, FaBook, FaTrophy, FaCog, FaBars, FaTimes } from 'react-icons/fa'

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const menuItems = [
    { icon: FaHome, label: 'ホーム', path: '/home', color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { icon: FaBook, label: '日記', path: '/history', color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { icon: FaTrophy, label: '実績', path: '/tasks', color: 'bg-gradient-to-br from-yellow-400 to-orange-600' },
    { icon: FaCog, label: '設定', path: '/settings', color: 'bg-gradient-to-br from-gray-400 to-gray-600' },
  ]

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* メニューパネル */}
      <div 
        className={`
          absolute top-20 right-0 bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-4
          transition-all duration-300 transform origin-top-right border-4 border-pink-200
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="flex flex-col gap-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsOpen(false)
                }}
                className={`
                  group flex items-center gap-4 px-6 py-4 rounded-2xl text-white font-bold text-lg
                  ${item.color} hover:scale-105 transform transition-all shadow-lg
                `}
                style={{ 
                  animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none' 
                }}
              >
                <Icon className="text-2xl" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* トグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-white text-2xl
          transform transition-all duration-300
          ${isOpen 
            ? 'bg-gradient-to-br from-red-400 to-pink-500 rotate-90' 
            : 'bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 hover:scale-110 animate-pulse-slow'
          }
        `}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
        
        {/* メニューラベル */}
        {!isOpen && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            メニュー
          </div>
        )}
      </button>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Menu