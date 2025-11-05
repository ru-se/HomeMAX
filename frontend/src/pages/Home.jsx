import React, { useState, useEffect, useRef, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import Menu from '../components/menu/Menu'
import { ToastContainer, toast, Slide } from 'react-toastify'
import { useTasks } from '../contexts/TasksContext'
import { HistoryContext } from '../App'
import VoiceInputSimple from '../components/VoiceInputSimple'
import HomemaxAnimated from '../components/HomemaxAnimated'
import TutorialModal from '../components/TutorialModal'
import { FaEnvelopeOpenText } from 'react-icons/fa' //封筒アイコン
import { FaTimesCircle } from 'react-icons/fa' //閉じるボタンのアイコン
import '../styles/Home.css'
import ParticleField from '../components/ParticleField'


const Home = () => {
  const [userMessage, setUserMessage] = useState('')
  const [compliment, setCompliment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState(null)
  const [modeName, setModeName] = useState('ほめマックス')
  const [showTutorial, setShowTutorial] = useState(false)
  const [title, setTitle] = useState('お手紙をくれたあなたへ')
  
  const location = useLocation()
  const hasRun = useRef(false)
  const hasShownTutorial = useRef(false)
  const { completeTaskByTitle } = useTasks()
  const { history, setHistory } = useContext(HistoryContext)
  const speechSynthesis = window.speechSynthesis

  const [isComplimentReady, setIsComplimentReady] = useState(false) // 褒め言葉の生成が完了したか
  const [isComplimentVisible, setIsComplimentVisible] = useState(false) // ユーザーが手紙を開いたか
  
  const [isInputVisible, setIsInputVisible] = useState(true) //入力ボックスの表示状態
  

  

  // Start→Home 遷移時に表示（「今後表示しない」設定がなければ）
  useEffect(() => {
    const dontShow = localStorage.getItem('homemax_modal_dontshow') === 'true'
    if (location.state?.showTutorial && !dontShow) {
      setShowTutorial(true)
    }
  }, [location.state])

  // モーダルからの送信／クローズ
  const handleTutorialClose = (dontShow) => {
    if (dontShow) localStorage.setItem('homemax_modal_dontshow', 'true')
    setShowTutorial(false)
  }
  const handleTutorialSubmit = (text, dontShow) => {
    if (dontShow) localStorage.setItem('homemax_modal_dontshow', 'true')
    setShowTutorial(false)
    if (text && text.trim()) {
      // そのまま Home の送信フローへ
      handleSend(text.trim())
    }
  }

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

  // 絵文字などを除去するユーティリティ
  const stripEmojis = (input) => {
    if (!input) return ''
    // Unicode プロパティが使える環境ではこちらを優先
    try {
      return input
        .replace(/\p{Extended_Pictographic}/gu, '') // 絵文字本体
        .replace(/[#*0-9]\uFE0F?\u20E3/g, '')       // キーキャップ絵文字 #️⃣, 1️⃣ など
        .replace(/[\u200D\uFE0E\uFE0F]/g, '')       // ZWJ・バリエーション選択子
    } catch {
      // フォールバック（旧ブラウザ向け）
      return input
        .replace(/[\u2700-\u27BF]/g, '')
        .replace(/[\uE000-\uF8FF]/g, '')
        .replace(/[\u2011-\u26FF]/g, '')
        .replace(/\uD83C[\uDC00-\uDFFF]/g, '')
        .replace(/\uD83D[\uDC00-\uDFFF]/g, '')
        .replace(/\uD83E[\uDD00-\uDDFF]/g, '')
        .replace(/[\u200D\uFE0E\uFE0F]/g, '')
    }
  }

  // 端末のボイス一覧
  const [voices, setVoices] = useState([])
  // 好みの日本語ボイスを保持
  const [preferredVoice, setPreferredVoice] = useState(null)

  // 日本語の「かわいめ」候補を優先的に選ぶ
  const pickCuteJapaneseVoice = (voices) => {
    const ja = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ja'))
    const candidates = [
    'Google 日本語', 'Kyoko', 'Kyoko (Enhanced)', 'Otoya',
    'Microsoft Nanami', 'Microsoft Haruka', 'Nanami', 'Haruka',
    'Siri' // iOS系で日本語Siriが返ることがある
  ]
    return ja.find(v => candidates.some(name => v.name.includes(name))) || ja[0] || null
  }

  // 名前候補リストから最適な日本語ボイスを選ぶ
  const selectJapaneseVoiceByNames = (names) => {
    const ja = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ja'))
    return ja.find(v => names.some(name => v.name.includes(name))) || null
  }

  // モードごとのおすすめ音声
  const voiceForMode = () => {
    if (!voices.length) return null
    switch (modeName) {
      case 'ギャルです。ギャル語を使って話します。絵文字をたくさん使います。':
        // 可愛い・明るめ
        return selectJapaneseVoiceByNames(['Siri', 'Kyoko', 'Google 日本語', 'Haruka', 'Nanami'])
      case '病んでる人です。ネガティブなことを言います。人のこのは褒めるけど自分と比べてさらに病みます。':
        // 低め・落ち着き
        return selectJapaneseVoiceByNames(['Otoya', 'Naoki'])
      case 'オタクです。語尾は「ござる」や「でござるよ」です。Twitterで使われるネットミームを使います。':
        // ちょい早口・やや高め
        return selectJapaneseVoiceByNames(['Otoya', 'Naoki', 'Kyoko', 'Google 日本語'])
      default:
        // ノーマル
        return selectJapaneseVoiceByNames(['Kyoko', 'Google 日本語', 'Haruka', 'Nanami']) || preferredVoice
    }
  }

  // モードごとのピッチ・スピード
  const ttsParamsForMode = () => {
    switch (modeName) {
      case 'ギャルです。ギャル語を使って話します。絵文字をたくさん使います。':
        return { rate: 1.55, pitch: 1.75 }
      case '病んでる人です。ネガティブなことを言います。人のこのは褒めるけど自分と比べてさらに病みます。':
        return { rate: 0.95, pitch: 0.9 }
      case 'オタクです。語尾は「ござる」や「でござるよ」です。Twitterで使われるネットミームを使います。':
        return { rate: 1.35, pitch: 1.2 }
      default:
        return { rate: 1.35, pitch: 1.4 }
    }
  }

  // 端末のボイス一覧をロード（voiceschanged にも対応）
  useEffect(() => {
  const loadVoices = () => {
    const voices = window.speechSynthesis?.getVoices() || []
    setVoices(voices)
    const v = pickCuteJapaneseVoice(voices)
    setPreferredVoice(v)
    // デバッグ用ログ（選ばれた声と候補一覧）
    console.log('[TTS] available voices:', voices.map(x => `${x.name} (${x.lang})`))
    console.log('[TTS] selected voice:', v ? `${v.name} (${v.lang})` : 'none (fallback to default)')
  }
  loadVoices()
  window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
  return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices)
}, [])

  // 音声読み上げ
  const speakCompliment = (text) => {
    // 連続呼び出しで重ならないようにキャンセル
    if (speechSynthesis.speaking) speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(stripEmojis(text))
    utterance.lang = 'ja-JP'
    const { rate, pitch } = ttsParamsForMode()
    utterance.rate = rate
    utterance.pitch = pitch
    const v = voiceForMode() || preferredVoice
    if (v) utterance.voice = v
    speechSynthesis.speak(utterance)
  }

  const handleSend = async (message) => {
    const textToSend = message || userMessage
    if (!textToSend.trim()) return

    setUserMessage(textToSend)
    setIsLoading(true)
    setCompliment('')

    setIsComplimentVisible(false) // 新しい送信時には非表示に戻す
    setIsComplimentReady(false)  // 新しい送信時には未完了に戻す

    setIsInputVisible(false);

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
      // speakCompliment(data.compliment)
      setTitle(data.title)

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
      setIsComplimentReady(true) // 褒め言葉の生成が完了したことを通知
      
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('送信に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenLetter = () => {
    if (compliment && isComplimentReady) {
        
        // 封筒DOM要素を取得
        const envelope = document.getElementById('envelope-animation');
        
        if (envelope) {
            // 3Dアニメーションを開始
            envelope.classList.add('open');

            // アニメーション完了を待って、褒め言葉のボックスと読み上げを表示
            // CSSアニメーション時間(0.6s + 0.3s遅延)よりも少し長く待機
            setTimeout(() => {
                setIsComplimentVisible(true); 
                speakCompliment(compliment);
                setIsComplimentReady(false); // 封筒を消す
            }, 1000); // 1000ms (1秒) 待機
            
        } else {
            // DOM要素が見つからない場合はすぐに表示
            setIsComplimentVisible(true);
            speakCompliment(compliment);
            setIsComplimentReady(false);
        }
    }
  }




  const modes = [
    { value: 'ほめマックス', label: 'ノーマル', emoji: '😊' ,fontClass: 'font-kiwi-maru'},
    { value: 'ギャルです。ギャル語を使って話します。絵文字をたくさん使います。', label: 'ギャル', emoji: '💖' , fontClass: 'font-hachi-maru-pop'},
    { value: '病んでる人です。ネガティブなことを言います。人のこのは褒めるけど自分と比べてさらに病みます。', label: '病み', emoji: '😢' , fontClass: 'font-shippori-mincho'},
    { value: 'オタクです。語尾は「ござる」や「でござるよ」です。Twitterで使われるネットミームを使います。', label: 'オタク', emoji: '🤓' , fontClass: 'font-dot-gothic16'},
  ]

    //モード名から宛名を生成する関数
  const generateAddress = (mode) => {
    switch (mode) {
      case 'ほめマックス':
        return 'ほめマックス';
      case 'ギャルです。ギャル語を使って話します。絵文字をたくさん使います。':
        return 'ギャルマックス';
      case '病んでる人です。ネガティブなことを言います。人のこのは褒めるけど自分と比べてさらに病みます。':
        return '病みマックス';
      case 'オタクです。語尾は「ござる」や「でござるよ」です。Twitterで使われるネットミームを使います。':
        return 'オタマックス';
      default:
        return 'ほめマックス';
    }
  }
  // 3. 依存関係のある変数を定義 (modeName, modes に依存)
  const currentAddress = generateAddress(modeName);
  const currentMode = modes.find(mode => mode.value === modeName) || modes[0];

  //褒め言葉表示を閉じる関数
  const handleCloseCompliment = () => {
    // 1. 音声読み上げの停止
    if (speechSynthesis && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    // 2. 褒め言葉の表示を閉じる
    setCompliment('');
    setIsComplimentVisible(false);
    
    // 3. 入力ボックスとモード選択を再表示
    setIsInputVisible(true);
  }


  return (
    <div className='h-screen w-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-blue-50 flex flex-col relative'>
      {/* 背景パーティクル（背面レイヤー） */}
      <ParticleField />
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
      {showTutorial && (
        <TutorialModal
          onClose={handleTutorialClose}
         onSubmit={handleTutorialSubmit}
        />
      )}

      {/* メニュー */}
      {/* <Menu /> */}

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-start pt-4 px-4 md:px-8 relative z-10 font-kiwi-maru">
        {/* ほめマックスキャラクター */}
        <div className="mb-4 md:mb-6">
          <HomemaxAnimated isLoading={isLoading} mode={currentMode.value} />
        </div>

        {/* メッセージ表示エリア */}

    {/* min-hを削除し、封筒の高さ分確保します */}
    <div className="w-full max-w-3xl mb-4 flex flex-col justify-center items-center">
            {/* 1. 手紙を開く（封筒）コンポーネント */}
        {isComplimentReady && !isComplimentVisible && (
          <>
          <div className="text-pink-500 font-extrabold text-lg mb-2 animate-bounce">
                タップして開けてね！
              </div>
          
            <div className="scene">
                {/* クリックイベントを封筒全体に適用 */}
                <div 
                    className="envelope" 
                    onClick={handleOpenLetter} // ボタンの代わり
                    id="envelope-animation" // JSでクラスをトグルするために使用
                >
                    <div className="flap"></div>
                    
                    {/* 中の手紙は、ここでは褒め言葉そのものではなく、単なる表示用として残します */}
                    <div className="letter">
                        <p>　</p>
                    </div>
                </div>
            </div>
          </>
        )}

          {/* 2. 褒め言葉の表示 */}
          {isComplimentVisible && compliment && (
            <div 
              className="fixed inset-0 z-40" // z-40 は手紙の z-50 より小さくする
              onClick={handleCloseCompliment} // 背景クリックで閉じる関数を呼び出す
            >

    <div
      className="fixed bottom-5 inset-x-0 flex justify-center z-50 px-8"
      onClick={(e) => e.stopPropagation()} // 手紙外だけで閉じる
    >
              <div
                 onClick={(e) => e.stopPropagation()} // 手紙内クリックは閉じない
                // 変更前: className="w-full bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-6 shadow-2xl border-4 border-pink-300 animate-bounce-in text-center"

                //お手紙風デザインの適用
                className={`
                  relative 
                  bg-[#ffdacc] 
                  shadow-lg shadow-yellow-300/50 
                  border-2 border-dashed border-white 
                  p-6 sm:p-8 
                  text-[#454545]
                  w-full
                  animate-bounce-in 
                  text-center
                  
                  mb-5

                  max-w-3xl
                  
                  
           

                  max-h-[17em] overflow-y-auto
                  letter-scrollbar
                  
                  /* 5pxの枠線に見えるようにシャドウとボーダーを調整 */
                  // [box-shadow:0px_0px_0px_5px_#ffdacc]
                `}
                
              >
                {/* ★ 追加: 閉じるボタン */}
                 {/* <button 
                    onClick={handleCloseCompliment}
                    className="absolute  text-4xl text-gray-500 hover:text-gray-700 transition duration-150"
                 >
                  <FaTimesCircle />
                 </button> */}
                 <p 
                  className={`text-xl font-bold leading-[2.5em] [background-image:linear-gradient(180deg,#9C6924_1px,transparent_1px)] [background-size:100%_2.5em] text-left {x} ${currentMode.fontClass}`}             
                  style={{
                      // パディングを調整し、線の描画位置を制御
                      paddingTop: '5px', 
                      paddingBottom: '5px',
                      paddingBottom: '20px',
                      // line-height が 2.5em に固定されるため、テキストが線の高さに合わせて表示されます
                  }}
                  >

                    {/* 線の描画はpタグ全体に適用されているため、<p>要素を分けます */}
                    <span className="block text-center mb-2 text-2xl font-extrabold text-[#9C6924]">
                        {title}
                    </span>
                    {/* <span className="block border-t border-dashed border-[#9C6924]/50 my-2"></span>  */}

                    {/* 褒め言葉本体 */}
                    {compliment}
                    <span className="block border-t border-dashed border-[#9C6924]/50 my-2"></span> 
                    <span className="block text-center mb-2 text-2xl font-extrabold text-[#9C6924]">
                        {currentAddress}より
                    </span>

                  </p>             
               </div>
               </div>
               </div>
            )}

            {/* 3. ローディング表示 */}
            {isLoading && (
              <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-lg flex items-center justify-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="ml-4 text-gray-600 text-xl" style={{fontFamily: 'HomeMAXFont, sans-serif'}}>一生懸命考え中...</p>
              </div>
            )}



        </div>




        <div className="w-full max-w-3xl mx-auto -mt-10 md:-mt-14 lg:-mt-16 mb-2">
          {isInputVisible && (
            <>
              <VoiceInputSimple 
                onSend={handleSend}
                inputPlaceholder={currentAddress}
              />
              {/* モード選択（フォーム直下・折り返しで重なり防止） */}
              <div className="mt-4 mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                {modes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setModeName(mode.value)}
                    className={`
                      px-6 py-3 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2 font-kiwi-maru
                      ${modeName === mode.value 
                        ? 'bg-[#9C6924] text-white shadow-xl scale-105' 
                        : 'bg-white/80 text-[#9C6924] hover:bg-gray-100 shadow-lg'
                      }
                    `}
                  >
                    <span className="text-2xl">{mode.emoji}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home