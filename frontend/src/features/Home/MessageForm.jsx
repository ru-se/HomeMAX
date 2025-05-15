// メッセージを送信するためのフォーム

import React, { useState } from 'react'

const MessageForm = ({ onSend }) => {

  // メッセージの状態を管理するためのuseStateフック
  const [text, setText] = useState('')

  // メッセージ送信状態の管理
  const [isMessageSent, setIsMessageSent] = useState(false) 

  const [messageCount, setMessageCount] = useState(0) // メッセージカウントの状態を管理

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
            onSend(text) //
            setText('') // メッセージ送信後にテキストエリアをクリア
            setIsMessageSent(true) // メッセージ送信状態を更新
          }}
        >
          送信
        </button>
        {isMessageSent && (
          <button
          >
            もう大丈夫
          </button>
        )}
      </div>
    </div>
  )
}

export default MessageForm