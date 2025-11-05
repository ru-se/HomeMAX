import React, { useState, useRef, useEffect, useCallback } from 'react'
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa'
import '../styles/Home.css'
import { TbMailShare } from "react-icons/tb";

const VoiceInputSimple = ({ onSend,inputPlaceholder }) => {
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  const textareaRef = useRef(null); //追加
  const [isSending, setIsSending] = useState(false);

  const [showGlobalMailAnimation, setShowGlobalMailAnimation] = useState(false); // グローバルアニメーションの状態
  const addressText = inputPlaceholder;
  const [isComposing, setIsComposing] = useState(false); // 追加: IME中フラグ


  //テキストの長さに応じて高さを調整するロジック
  // useEffect(() => {
  //   if (textareaRef.current) {
  //     // 1. 高さを一旦リセットして、最小の状態に戻す
  //     textareaRef.current.style.height = 'auto'; 
      
  //     // 2. コンテンツの実際の高さ（scrollHeight）を取得し、高さを設定
  //     textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  //   }
  // }, [text]); // textステートが変更されるたびに実行

 useEffect(() => {
    if (textareaRef.current) {
      // 1. 高さを一旦リセットして、最小の状態に戻す
      textareaRef.current.style.height = 'auto'; 
      
      // 2. コンテンツの実際の高さ（scrollHeight）を取得し、高さを設定
      // CSSのmaxHeight(10em)を超えると、それ以上高さは伸びず、スクロールが有効になる
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]); // textステートが変更されるたびに実行

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

  // const handleSend = () => {
  //   if (text.trim() === '') return
  //   onSend(text)
  //   setText('')
  //   if (isListening) {
  //     recognitionRef.current.stop()
  //     setIsListening(false)
  //   }
  // }

const handleSend = useCallback(() => {
    if (text.trim() === '' || isSending) return;

    const textPayload = text; // 送信するテキストを保存

    // 1. 送信処理の開始とアニメーションの表示
    setIsSending(true);
    setShowGlobalMailAnimation(true);
    setText(''); // ユーザーの入力テキストは即座にクリア

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    

    // 2. アニメーションの実行時間（800ms）を待つ
    setTimeout(() => {
      
      // 3. アニメーションの終了
      setIsSending(false);
      setShowGlobalMailAnimation(false); 
      
      // ↓↓↓ 【修正】アニメーションが完了してから親に通知 ↓↓↓
      // 完了を通知することで、親コンポーネントがAPIを叩き、入力ボックスを非表示にする
      onSend(textPayload); 

      

    }, 1000); // アニメーション時間(800ms)より少し長く待機

  }, [text, isSending, isListening, onSend]);  // ユーザーの入力部分のみを抽出するロジック
const handleTextChange = (e) => {
    const fullText = e.target.value;
    const addressLength = fixedAddressText.length;

    // 宛名以降の部分を取得し、textステートを更新
    // ユーザーが宛名部分を削除しようとした場合でも、正しいユーザー入力部分を取得
    let userInput = fullText.substring(addressLength);

    // ユーザーが意図せず入力した宛名直後の改行やスペースをトリム（削除）する
    userInput = userInput.trimStart(); 
    
    setText(userInput);
  };
    // Tailwind CSSアニメーションを定義するスタイルタグ
  // Reactコンポーネント内で直接定義することで、単一ファイルでの実行を可能にする
  const keyframesStyle = (
    <style>
      {`
        @keyframes fly-out {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-80vh) scale(0.5); /* 画面上端へ */
            opacity: 0;
          }
        }
        .animate-fly-out {
          animation: fly-out 8s ease-out forwards;
        }

        textarea:focus-visible {
            /* 1. グローバルなoutline（ピンク色の原因）をリセット */
            outline: none !important; 
            outline-offset: 0 !important;

            /* 2. box-shadowで「オフセット（間隔）」と「茶色のリング」を再現 */
            /* box-shadow: [オフセットの影], [リングの影] */
            /* オフセットの影: 0 0 0 2px #fff0cd (背景色と同じ色の2pxの隙間) */
            /* リングの影: 0 0 0 4px #34230cff (隙間の外側に2px幅の茶色いリングを描画) */
            box-shadow: 0 0 0 4px #fff0cd, 0 0 0 6px #FFAA33 !important;
        }

        textarea::-webkit-scrollbar {
          width: 2px;
        }

        textarea::-webkit-scrollbar-track {
          background: #fff0cd; /* テキストボックスの背景色に合わせる */
          border-radius: 5px;
        }

        textarea::-webkit-scrollbar-thumb {
          background: #43331eb4; /* 送信ボタンの色 */
          border-radius: 5px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
          background: #ffdb88; /* ホバー時の色 */
        }
        
        /* 2. Firefox */
        textarea {
          /* overflow-y-scroll クラスが適用されているため、textarea自体に適用 */
          scrollbar-color: #9C6924 #fff0cd;
          scrollbar-width: thin;
        }


      `}
    </style>
  );

  // ボタンのハンドラを決定するロジック
  // textがあればhandleSend、なければtoggleListening
  const buttonHandler = text.trim() ? handleSend : toggleListening;

  // ボタンのアイコンを決定するロジック
  // textがあればFaPaperPlane、なければFaMicrophone
  const buttonIcon = text.trim() ? FaPaperPlane : FaMicrophone;

  // ボタンのスタイルを決定するロジック
  let buttonClasses = `
    flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl
    transition-all transform shadow-xl absolute bottom-3 right-2 z-20
  `;

  if (text.trim()) {
    // 送信ボタンのスタイル
    buttonClasses += ' bg-gradient-to-r from-[#FFAA33] to-[#ffb866] hover:scale-110';
  } else {
    // ボイス入力ボタンのスタイル
    buttonClasses += ` 
      ${isListening 
        ? 'bg-gradient-to-br from-[#EE0077] to-[#ffa299] animate-pulse' 
        : 'bg-[#a7732b]'
      }
      hover:scale-110
    `;
  }

  // 送信中は無効化
  const isButtonDisabled = isSending && text.trim();

  const fixedAddressText = inputPlaceholder ? `${inputPlaceholder}` : '';  

  const addressLength = fixedAddressText.length;

  




  return (
    <>
      {keyframesStyle}
        {showGlobalMailAnimation && (
          <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-[999]"
          >
          <TbMailShare 
            size={80} 
            className="text-pink-500 fill-pink-300 animate-fly-out" 
            style={{ animationDelay: '0s' }}
          />
          </div>
        )}

    {/* // <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-6 border-4 border-[#ffa299]"> */}
    {/* // 入力エリアを画面下部に固定 */}
    {/* <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 font-sans z-50">  */}

    {/* 変更後: 幅を制限し、中央に配置（mx-auto）する通常のブロック要素にする */}
    {/* <div className="w-full max-w-3xl mx-auto px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 font-sans z-50">  */}
    {/* ↑ fixed bottom-0 を削除しました。幅は max-w-3xl mx-auto で親要素に依存します。 */}

    {/* 入力エリアの全体ラッパー (fixedを外し、親要素のフローに配置) */}
    <div className="w-full max-w-3xl mx-auto px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 font-sans">


    {/* レスポンシブ対応のためにパディングを調整  */}
    {/* <div className="max-w-3xl mx-auto flex flex-col items-center"> */}

{/* レスポンシブ対応のためにパディングを調整  */}
    {/* ↓↓↓ flex-col justify-end を削除し、伸びる方向の制御を textarea の margin/padding に委ねます ↓↓↓ */}
    <div className="max-w-3xl mx-auto flex flex-col items-center"> 
        {/* ↑ justify-end を削除しました。 */}

      {/* 折られた角付きボックス (bg-transparent で背景色を透明化) */}   
        <div 
        className={`
          relative 
          bg-[#fff0cd] 
          shadow-lg shadow-yellow-300/50 
          border-2 border-dashed border-white 
          p-4 sm:p-6 lg:p-8
          text-[#454545]
          w-full max-w-3xl mx-auto
          
          
          
          /* 疑似要素:after 角のリボン の定義 */
          after:absolute 
          after:content-[''] 
          after:right-[-7px] 
          after:top-[-7px] 
          after:[border-width:0_15px_15px_0] 
          after:border-solid 
          after:[border-color:#ffdb88_#fff_#ffdb88] 
          after:[box-shadow:-1px_1px_1px_rgba(0,0,0,0.15)]
          
          /* 5pxの枠線に見えるようにシャドウとボーダーを調整 */
          [box-shadow:0px_0px_0px_5px_#fff0cd]
        `}
      >

      <div className="flex gap-4 items-center">

{/* ↓↓↓ 【修正】宛名表示とテキスト入力をラップするコンテナ ↓↓↓ */}
<div className="flex-1 min-h-[5em]">
                
                {/* 1. 宛名表示ブロック (テキストエリアの領域内) */}
                <div 
                    className="w-full text-xl font-bold leading-[2.5em] text-left pointer-events-none font-kiwi-maru"
                    style={{
                        // fontFamily: 'UserFont, sans-serif',
                       padding: '12px', 
                    lineHeight: '2.5em',
                        // 便箋の線を背景に持つ
                      height: '2.5em',
                    }}
                >
                    {/* 宛名 */}
                    <span className="block text-2xl font-extrabold text-[#9C6924] leading-none font-kiwi-maru">
                        {addressText}へ
                    </span>
                    
                    {/* 宛名の後の空行は、textareaのmarginで調整します */}
                </div>


                {/* 2. 実際のテキストエリア (ユーザー入力) */}
                <textarea
                  ref={textareaRef} 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} // 元のシンプルな onChange に戻す
                  onKeyDown={
                    (e) => {
                      if (e.key !== 'Enter') return
                      if (e.shiftKey) return   
                      if(isComposing) return; // 追加: IME中は無視
                      e.preventDefault(); // 改行を防止
                      handleSend();
                    }
                  }
                  onCompositionStart={() => setIsComposing(true)} // IME変換開始
                  onCompositionEnd={() => setIsComposing(false)}  // IME変換終了
                  placeholder={"がんばったこと、話してね！"} 
                  maxLength={200}
                  
                  // padding-top を最小限にし、上にmarginをかけて宛名の下に配置
                  className="w-full bg-#fff0cd resize-none p-3 pt-0 leading-[2.5em] [background-image:linear-gradient(180deg,#9C6924_1px,transparent_1px)] [background-size:100%_2.5em] [word-wrap:break-word] text-xl self-end font-bold overflow-y-auto focus:outline-none focus:ring-0 font-kiwi-maru letter-scroll"              
                  style={{
                    // fontFamily: 'UserFont, sans-serif',
                    minHeight: '2.5em', /* 1行分の高さ */
                    maxHeight: '7.5em', /* 3行分。宛名と合わせて4行 */
                    backgroundAttachment: 'local',
                    // ↓↓↓ 【重要】宛名の空行分、上マージンをかける ↓↓↓
                    marginTop: '0',
                    // 2.5em (宛名ブロックの高さ) + 線の位置調整 (12px) を行う
                    paddingTop: '1em',
                    // 線の位置調整を維持
                    backgroundPositionY: '12px',
                    
                  }}
                />
              </div>        {/* 送信ボタン */}
        {/* <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`
            flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl
            transition-all transform shadow-xl
            ${text.trim()
              ? 'bg-gradient-to-r from-[#FFAA33] to-[#ffb866] hover:scale-110'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          <FaPaperPlane />
        </button> */}

        {/* **統合されたボタン** */}
        <button
          onClick={buttonHandler}
          disabled={isButtonDisabled} // 送信中のみ無効化
          className={buttonClasses}
        >
          {/* 条件に応じてアイコンをレンダリング */}
          {React.createElement(buttonIcon)}
        </button>

      </div>
   
      {/* 文字数カウント */}
      {text && (
        <div className="mt-3 mr-16 text-right">
          <span className="text-sm text-gray-500">{text.length}/200文字</span>
        </div>
      )}


      </div>
    </div>
    </div>
    </>
  )
}

export default VoiceInputSimple