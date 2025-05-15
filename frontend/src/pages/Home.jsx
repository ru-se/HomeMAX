// ホームページ

import React from 'react'
import MessageForm from '../features/Home/MessageForm'
import UserMessageBubble from '../features/Home/UserMessageBubble'

const Home = () => {
  
  const handleSend = (userMessage) => {
    // ここでメッセージを送信する処理を実装
    console.log('Sending message:', userMessage)
  }

  return (
    <div>
      <div className='absolute right-0'>
        <UserMessageBubble />
      </div>
      <div className='absolute bottom-0 left-0 right-0'>
        <MessageForm onSend={handleSend} />
      </div>
    </div>
  )
}

export default Home