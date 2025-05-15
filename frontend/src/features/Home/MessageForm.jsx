// メッセージを送信するためのフォーム

import React, { useState } from 'react'

const MessageForm = ({ onSend, isMessageSent, setIsMessageSent, OKCount, setOKCount }) => {

  // メッセージの状態を管理するためのuseStateフック
  const [text, setText] = useState('')

  

  return (
    <div className='flex flex-col items-center justify-center'>
      <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メッセージを入力してください"
          rows="4"
          cols="50"
      />
      <div className='flex items-center justify-center'>
        <button
          onClick={() => {
            onSend(text) 
            setText('') // メッセージ送信後にテキストエリアをクリア
            setIsMessageSent(true) // メッセージ送信状態を更新
          }}
        >
          送信
        </button>
        {isMessageSent && (
          <button
            onClick={() => {
              setOKCount(OKCount + 1) // もう大丈夫押した回数を増やす
              if(OKCount >= 5) {
                setIsMessageSent(false) // もう大丈夫を押したらメッセージ送信状態を更新
                setOKCount(1) // もう大丈夫を押したら回数をリセット
              } 
              console.log(`もう大丈夫を${OKCount}回押しました`);
              
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