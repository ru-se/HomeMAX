// メッセージを送信するためのフォーム

import React, { useState , useRef} from 'react'
import { toast, ToastContainer, Slide } from 'react-toastify'
import { useTasks } from '../../contexts/TasksContext';

const MessageForm = ({ onSend, isMessageSent, setIsMessageSent, OKCount, setOKCount, setIsInputChange, isSulking }) => {

  // メッセージの状態を管理するためのuseStateフック
  const [text, setText] = useState('')

  const [enterCount, setEnterCount] = useState(0)

  const [hasShownTypingToast, setHasShownTypingToast] = useState(false) 
  const [hasShownEnglishToast, setHasShownEnglishToast] = useState(false)
  const hasRun = useRef(false);
  const hasRun_english = useRef(false);
  const { completeTaskByTitle } = useTasks();
  
  //送信処理
  const handleSend = () => {
    if (text.trim() === '') return // 空メッセージは送信しない

    if (text.trim() === 'いつもありがとう') {
    toast('ありがとう” が届きました。あなたの心意気、世界をあたためるね！', {
      style: {
        background: 'linear-gradient(90deg, #ff8a00, #e52e71, #00c3ff)',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        boxShadow: '0 0 20px #ff8a00, 0 0 40px #e52e71',
        border: '2px solid #fff',
        textShadow: '0 2px 8px #e52e71',
      }
    })
    completeTaskByTitle("いつもありがとうと言う");
  }
    if (isSulking && text.trim() === 'ごめんね') {
      setOKCount(0)
      setIsMessageSent(false)
      setText('')
      return
    }
    onSend(text)
    setText('') // メッセージ送信後にテキストエリアをクリア
    setIsMessageSent(true) // メッセージ送信状態を更新
    setEnterCount(0)
  }

  const handleInputWord = async (e) => {
    if(hasRun.current) return;
      hasRun.current = true;
    try {
    const taskRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ task_title: "キーボード入力" }),
    });
    const taskData = await taskRes.json();

    if (hasShownTypingToast && hasRun.current) return;
     
      toast(`一文字打ったあなたの手、確かに未来を動かしてるよ。タスク達成！すごい！`, {
        style: {
          background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)'
        }
      });
      completeTaskByTitle("キーボード入力");
      setHasShownTypingToast(true)
      hasRun.current = true;
  } catch (e) {
    // エラー時は何もしない or 必要ならエラートースト
  }
  }

  const handleInputEnglish = async (e) => {
    if(hasRun_english.current) return;
      hasRun_english.current = true;
    try {
    const taskRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ task_title: "（英語？アルファベット？）使用" }),
    });
    const taskData = await taskRes.json();

    if (hasShownTypingToast || hasRun_english.current) {
      toast(`アルファベットを使えたあなた、もはや言語の魔法使いだね！タスク達成！すごい！`, {
        style: {
          background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)'
        }
      });
      completeTaskByTitle("（英語？アルファベット？）使用");
      setHasShownTypingToast(true)
      hasRun_english.current = true;
    }
  } catch (e) {
    // エラー時は何もしない or 必要ならエラートースト
  }
}


  

  return (
    <div className='flex flex-col items-center justify-center space-y-4'>
      <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            handleInputWord(e)
            handleInputEnglish(e)

          }}
          onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault() // 改行を防止
            setEnterCount(prev => {
              if (prev + 1 >= 2) {
                handleSend()
                return 0
              }
              return prev + 1
            })
          } else {
            setEnterCount(0) // 他のキーを押したらカウントリセット
          }
        }}
          placeholder="メッセージを入力してください"
          rows="3"
          cols="50"
          maxLength={500}
          className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1 resize-none"
      />
      <div className='flex items-center justify-center space-x-4'>
        <button
          onClick={handleSend}
          className="rounded-full bg-blue text-white px-16 py-4 font-kiwi-maru hover:bg-blue-dark shadow-xl"
        >
          送信
        </button>
        {isMessageSent && (
          <button
            onClick={() => {
              setOKCount(OKCount + 1) // もう大丈夫押した回数を増やす
              console.log(`もう大丈夫を${OKCount}回押しました`);
              if(OKCount >= 6) {
                setIsMessageSent(false) // もう大丈夫を押したらメッセージ送信状態を更新
                setOKCount(0) // もう大丈夫を押したら回数をリセット
              } 
            }}
            className={`rounded-full bg-pink px-16 py-4 font-kiwi-maru hover:bg-pink-dark shadow-xl ${isSulking ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSulking}
          >
            もう大丈夫
          </button>
        )}
      </div>
    </div>
  )
}

export default MessageForm