import React, { useState, useRef, useEffect } from 'react'
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa'

const VoiceInputSimple = ({ onSend }) => {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = 'ja-JP'
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          }
        }
        if (finalTranscript) {
          setText(prev => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('お使いのブラウザは音声認識に対応していません。')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSend = () => {
    if (text.trim() === '') return
    onSend(text)
    setText('')
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 border-4 border-blue-200">
      <div className="flex gap-4 items-center">
        {/* 音声入力ボタン */}
        <button
          onClick={toggleListening}
          className={`
            flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl
            transition-all transform hover:scale-110 shadow-xl
            ${isListening 
              ? 'bg-gradient-to-br from-red-400 to-pink-500 animate-pulse' 
              : 'bg-gradient-to-br from-pink-400 to-purple-500'
            }
          `}
        >
          <FaMicrophone />
        </button>

        {/* テキスト入力 */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="がんばったこと、話してね！"
          maxLength={200}
          className="flex-1 border-3 border-blue-300 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
        />

        {/* 送信ボタン */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`
            flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl
            transition-all transform shadow-xl
            ${text.trim()
              ? 'bg-gradient-to-r from-blue-400 to-cyan-500 hover:scale-110'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          <FaPaperPlane />
        </button>
      </div>

      {/* 文字数カウント */}
      {text && (
        <div className="mt-3 text-right">
          <span className="text-sm text-gray-500">{text.length}/200文字</span>
        </div>
      )}
    </div>
  )
}

export default VoiceInputSimple