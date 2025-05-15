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

  // 返ってくる褒め言葉
  const [compliment, setCompliment] = useState('')

  // ローディング状態の管理
  const [isLoading, setIsLoading] = useState(false) 

  // もう大丈夫押した回数の状態を管理
  const [OKCount, setOKCount] = useState(1) 

  const handleSend = async (userMessage) => {
    // ここでメッセージを送信する処理を実装
    setUserMessage(userMessage)
    console.log('Sending message:', userMessage)

    setIsLoading(true) // ローディング状態を更新
    try {
      const response = await fetch('http://localhost:8000/api/compliment/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          letter_id: 1, // 仮のID
          letter_message: userMessage 
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Received compliment:', data.compliment)

      // 褒め言葉を状態に保存
      setCompliment(data.compliment)
      setIsMessageSent(true)
      
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false) // ローディング状態を更新
    }
  }

  return (
    <div>
      {isMessageSent && (
        <div className='absolute left-0 top-1/2'>
          <HomemaxMessageBubble message={isLoading ? '生成中...' : compliment}/>
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
