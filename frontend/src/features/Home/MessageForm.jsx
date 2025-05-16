// メッセージを送信するためのフォーム

import React, { useState } from 'react'

const MessageForm = ({ onSend, isMessageSent, setIsMessageSent, OKCount, setOKCount }) => {

  // メッセージの状態を管理するためのuseStateフック
  const [text, setText] = useState('')

  //送信処理
  const handleSend = () => {
    if (text.trim() === '') return // 空メッセージは送信しない
    onSend(text)
    setText('') // メッセージ送信後にテキストエリアをクリア
    setIsMessageSent(true) // メッセージ送信状態を更新
    setOKCount(1) // メッセージ送信後にもう大丈夫を押した回数をリセット
  }

  

  return (
    <div className='flex flex-col items-center justify-center space-y-4'>
      <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault() // 改行を防止
            handleSend() // 送信処理を実行
          }
        }}
          placeholder="メッセージを入力してください"
          rows="3"
          cols="50"
          maxLength={500}
      />
      <div className='flex items-center justify-center space-x-4'>
        <button
          onClick={handleSend}
          className=""
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
          >
            もう大丈夫
          </button>
        )}
      </div>
    </div>
  )
}

export default MessageForm