import React, { useState, useEffect, useRef, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import Menu from '../components/menu/Menu'
import { ToastContainer, toast, Slide } from 'react-toastify'
import { useTasks } from '../contexts/TasksContext'
import { HistoryContext } from '../App'
import VoiceInputSimple from '../components/VoiceInputSimple'
import HomemaxAnimated from '../components/HomemaxAnimated'
import TutorialModal from '../components/TutorialModal'

const Home = () => {
  const [userMessage, setUserMessage] = useState('')
  const [compliment, setCompliment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [modeName, setModeName] = useState('ほめマックス')
  const [showTutorial, setShowTutorial] = useState(false)
  
  const location = useLocation()
  const hasRun = useRef(false)
  const hasShownTutorial = useRef(false)
  const { completeTaskByTitle } = useTasks()
  const { history, setHistory } = useContext(HistoryContext)
  const speechSynthesis = window.speechSynthesis

  // 初回訪問時にモーダル表示
  useEffect(() => {
    if (!hasShownTutorial.current) {
      const visited = localStorage.getItem('homemax_visited')
      if (!visited) {
        setShowTutorial(true)
        localStorage.setItem('homemax_visited', 'true')
        hasShownTutorial.current = true
      }
    }
  }, [])

  // ログイン時の通知
  useEffect(() => {
    if (location.state && location.state.signupSuccess && !hasRun.current) {
      hasRun.current = true
      ;(async () => {
        try {
          const taskRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ task_title: "ログイン" }),
          })
          const taskData = await taskRes.json()
          toast(`${taskData.task_name}`, { style: { background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)' } })
        } catch (e) {}
      })()
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // 音声読み上げ
  const speakCompliment = (text) => {
    if (!speechSynthesis) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 1.0
    speechSynthesis.speak(utterance)
  }

  const handleSend = async (message) => {
    const textToSend = message || userMessage
    if (!textToSend.trim()) return

    setUserMessage(textToSend)
    setIsLoading(true)
    setCompliment('')

    try {
      const letterRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/letter/addLetter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId, message: textToSend }),
      })
      const letterData = await letterRes.json()
      const letter_id = letterData.result.insertId

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/compliment/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          letter_id: letter_id,
          letter_message: textToSend,
          mode: modeName,
        }),
      })

      const data = await response.json()
      setCompliment(data.compliment)
      speakCompliment(data.compliment)

      setHistory(prev => [
        ...prev,
        {
          letter_message: textToSend,
          compliment: data.compliment,
          letter_date: new Date().toISOString(),
          compliment_date: new Date().toISOString()
        }
      ])

      setUserMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('送信に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const modes = [
    { value: 'ほめマックス', label: 'ノーマル', emoji: '😊' },
    { value: 'ギャルです。ギャル語を使って話します。絵文字をたくさん使います。', label: 'ギャル', emoji: '💖' },
    { value: '病んでる人です。ネガティブなことを言います。人のこのは褒めるけど自分と比べてさらに病みます。', label: '病み', emoji: '😢' },
    { value: 'オタクです。語尾は「ござる」や「でござるよ」です。Twitterで使われるネットミームを使います。', label: 'オタク', emoji: '🤓' },
  ]

  return (
    <div className='h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col relative'>
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

      {/* チュートリアルモーダル */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      {/* メニュー */}
      <Menu />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        {/* ほめマックスキャラクター */}
        <div className="mb-8">
          <HomemaxAnimated isLoading={isLoading} />
        </div>

        {/* メッセージ表示エリア */}
        <div className="w-full max-w-3xl mb-8">
          {compliment && (
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-6 shadow-2xl border-4 border-pink-300 animate-bounce-in text-center">
              <p className="text-xl font-bold leading-relaxed">{compliment}</p>
            </div>
          )}
          {isLoading && (
            <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-lg flex items-center justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="ml-4 text-gray-600">考え中...</p>
            </div>
          )}
        </div>

        {/* モード選択 */}
        <div className="w-full max-w-3xl mb-6">
          <div className="flex justify-center gap-3">
            {modes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setModeName(mode.value)}
                className={`
                  px-6 py-3 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2
                  ${modeName === mode.value 
                    ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-xl scale-105' 
                    : 'bg-white/80 text-gray-700 hover:bg-gray-100 shadow-lg'
                  }
                `}
              >
                <span className="text-2xl">{mode.emoji}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* 入力エリア */}
        <div className="w-full max-w-3xl">
          <VoiceInputSimple onSend={handleSend} />
        </div>
      </div>
    </div>
  )
}

export default Home