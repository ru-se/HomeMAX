import React, { useState, useRef, useEffect } from 'react'
import { FaMicrophone, FaKeyboard, FaPaperPlane } from 'react-icons/fa'

const VoiceInput = ({ onSend }) => {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [inputMode, setInputMode] = useState('voice') // 'voice' or 'text'
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Web Speech API の初期化
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = 'ja-JP'
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
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
    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border-4 border-blue-200">
      {/* モード切替 */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setInputMode('voice')}
          className={`
            px-8 py-3 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2
            ${inputMode === 'voice' 
              ? 'bg-pink-400 text-white shadow-xl scale-105' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          <FaMicrophone />
          音声で話す
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={`
            px-8 py-3 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2
            ${inputMode === 'text' 
              ? 'bg-blue-400 text-white shadow-xl scale-105' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          <FaKeyboard />
          文字で書く
        </button>
      </div>

      {/* 音声入力モード */}
      {inputMode === 'voice' && (
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={toggleListening}
            className={`
              w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl
              transition-all transform hover:scale-110 shadow-2xl
              ${isListening 
                ? 'bg-gradient-to-br from-red-400 to-pink-500 animate-pulse' 
                : 'bg-gradient-to-br from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600'
              }
            `}
          >
            <FaMicrophone />
          </button>
          <p className="text-xl font-bold text-center">
            {isListening ? (
              <span className="text-red-500 animate-pulse">🎤 聞いています...</span>
            ) : (
              <span className="text-gray-600">タップして話してね！</span>
            )}
          </p>
        </div>
      )}

      {/* テキスト入力モード */}
      {inputMode === 'text' && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="がんばったこと、聞いてほしいこと、なんでも話してね！"
          rows="6"
          maxLength={500}
          className="w-full border-3 border-blue-300 rounded-2xl p-6 text-lg focus:outline-none focus:ring-4 focus:ring-blue-400 resize-none"
        />
      )}

      {/* 入力テキスト表示 */}
      {text && (
        <div className="mt-6 p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-2">入力内容：</p>
          <p className="text-lg">{text}</p>
          <p className="text-right text-sm text-gray-500 mt-2">{text.length}/500文字</p>
        </div>
      )}

      {/* 送信ボタン */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`
            px-16 py-5 rounded-full text-2xl font-bold transition-all transform
            flex items-center gap-3 shadow-2xl
            ${text.trim()
              ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:scale-110 hover:shadow-3xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <FaPaperPlane />
          送信する！
        </button>
      </div>

      {/* ヒント */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 ヒント：「今日〇〇ができた」「〇〇がんばった」など、具体的に話すとより褒めてもらえるよ！
        </p>
      </div>
    </div>
  )
}

export default VoiceInput