import React, { useState } from 'react'
import { FaTimes, FaPaperPlane } from 'react-icons/fa'

const TutorialModal = ({ onClose, onSubmit }) => {
  const [draft, setDraft] = useState('')
  const [dontShowAgain, setDontShowAgain] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      aria-modal="true"
      role="dialog"
      onClick={() => onClose?.(dontShowAgain)} // モーダル外クリックで閉じる
    >
      <div
        className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full mx-8 p-8 md:p-12 relative animate-bounce-in"
        onClick={(e) => e.stopPropagation()} // 内側クリックは閉じない
      >
        {/* 閉じるボタン */}
        {/* <button
          onClick={() => onClose?.(dontShowAgain)}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xl transition-all transform hover:scale-110"
          aria-label="閉じる"
        >
          <FaTimes />
        </button> */}

        {/* タイトル */}
        <h2 className="text-3xl md:text-4xl font-black text-center mb-6 md:mb-8 whitespace-nowrap leading-tight">
          <span className="bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 bg-clip-text text-transparent">
            まずは最近やったことを書いてみて！
          </span>
        </h2>

        {/* 説明 */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 md:p-6 border-2 border-yellow-200">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              小さなことでも大丈夫。<br />
              書いてくれたら、ほめマックスが全力で褒めるよ。
            </p>
          </div>

          {/* 入力欄 */}
          <div className="bg-[#fff0cd] border-2 border-dashed border-white shadow-lg shadow-yellow-300/40 rounded-3xl p-4 md:p-6">
            <label className="block text-[#9C6924] font-bold mb-2">
              あなたの最近やったこと
            </label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="例）朝ごはんをちゃんと食べた／仕事のタスクをひとつ終わらせた／友だちに優しくできた"
              className="w-full h-28 md:h-32 rounded-2xl p-4 bg-white/90 border-2 border-[#FFAA33] focus:outline-none focus:ring-4 focus:ring-yellow-200 resize-none"
              maxLength={200}
            />
            <div className="mt-2 text-right text-sm text-gray-500">
              {draft.length}/200文字
            </div>
          </div>

          {/* 今後表示しない */}
          <label className="flex items-center gap-3 mt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-5 h-5 accent-pink-500"
            />
            <span className="text-gray-600">今後この案内を表示しない</span>
          </label>
        </div>

        {/* ボタン群 */}
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row gap-3 md:gap-4">
          <button
            onClick={() => onSubmit?.(draft.trim(), dontShowAgain)}
            disabled={!draft.trim()}
            className={`flex-1 py-4 rounded-full text-xl font-bold shadow-2xl transition-all ${
              draft.trim()
                ? 'bg-[#FFAA33] text-white hover:bg-[#ff9900] hover:shadow-xl hover:scale-105'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="inline-flex items-center gap-2 justify-center">
              <FaPaperPlane /> 送る
            </span>
          </button>
          <button
            onClick={() => onClose?.(dontShowAgain)}
            className="flex-1 py-4 rounded-full text-xl font-bold bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}

export default TutorialModal