import React from 'react'
import { FaTimes, FaMicrophone, FaKeyboard } from 'react-icons/fa'

const TutorialModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full mx-8 p-12 relative animate-bounce-in">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xl transition-all transform hover:scale-110"
        >
          <FaTimes />
        </button>

        {/* タイトル */}
        <h2 className="text-5xl font-black text-center mb-8">
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            ほめマックスへようこそ！
          </span>
        </h2>

        {/* 説明 */}
        <div className="space-y-6">
          {/* このアプリについて */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
            <h3 className="text-2xl font-bold text-pink-600 mb-3">✨ このアプリについて</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              どんな小さなことでも、あなたの「がんばり」を<br />
              <strong className="text-purple-600">全力で褒めちぎります！</strong><br />
              日常のこと、仕事のこと、なんでもOK！
            </p>
          </div>

          {/* 使い方 */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">📝 使い方</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center text-white text-xl flex-shrink-0">
                  <FaMicrophone />
                </div>
                <p className="text-lg text-gray-700">
                  <strong>音声入力：</strong>マイクボタンを押して話すだけ！
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white text-xl flex-shrink-0">
                  <FaKeyboard />
                </div>
                <p className="text-lg text-gray-700">
                  <strong>テキスト入力：</strong>入力欄に打ち込んでEnter！
                </p>
              </div>
            </div>
          </div>

          {/* 例 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <h3 className="text-2xl font-bold text-orange-600 mb-3">💡 例えば...</h3>
            <div className="space-y-2 text-gray-700">
              <p>「今日、早起きできた」</p>
              <p>「仕事で褒められた」</p>
              <p>「友達に優しくできた」</p>
            </div>
          </div>
        </div>

        {/* スタートボタン */}
        <button
          onClick={onClose}
          className="mt-8 w-full py-5 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-white rounded-full text-2xl font-bold shadow-2xl transform transition-all hover:scale-105"
        >
          さっそく使ってみる！
        </button>
      </div>
    </div>
  )
}

export default TutorialModal