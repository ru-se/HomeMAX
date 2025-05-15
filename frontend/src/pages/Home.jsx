// ホームページ

import React, { useState } from 'react'
import MessageForm from '../features/Home/MessageForm'
import UserMessageBubble from '../features/Home/UserMessageBubble'
import HomemaxImage from '../features/Home/HomemaxImage'
import HomemaxMessageBubble from '../features/Home/HomemaxMessageBubble'


const Home = () => {
  
  // メッセージ送信状態の管理
  const [isMessageSent, setIsMessageSent] = useState(false) 

  const [userMessage, setUserMessage] = React.useState('')

  // もう大丈夫押した回数の状態を管理
  const [OKCount, setOKCount] = useState(1) 

  const handleSend = (userMessage) => {
    // ここでメッセージを送信する処理を実装
    setUserMessage(userMessage)
    console.log('Sending message:', userMessage)
  }

  return (
    <div>
      {isMessageSent && (
        <div className='absolute left-0 top-1/2'>
          <HomemaxMessageBubble />
        </div>
      )}
      {/* ほめマックス画像 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <HomemaxImage />
      </div>
      {/* ユーザーの送信したメッセージ */}
      <div className="absolute right-0 top-1/2">
        <UserMessageBubble message={userMessage} />
      </div>
      {/* メッセージ送信フォーム */}
      <div className="absolute bottom-0 left-0 right-0 ">
        <MessageForm onSend={handleSend} isMessageSent={isMessageSent} setIsMessageSent={setIsMessageSent} OKCount={OKCount} setOKCount={setOKCount} />
      </div>
    </div>
  )
}

export default Home