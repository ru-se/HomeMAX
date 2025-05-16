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
  const [OKCount, setOKCount] = useState(0) 

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
    <div className='w-full h-screen overflow-hidden bg-white flex flex-col'>
      <div className='flex w-full h-3/4'>
        {/* ほめマックスの吹き出し  */}
        <div className='basis-1/3 flex justify-center mt-10'>
          {isMessageSent && (
            <div className=''>
              <HomemaxMessageBubble message={isLoading ? '生成中...' : compliment}/>
            </div>
          )}
        </div>
        {/* ほめマックス画像 */}
        <div className=" basis-1/3 flex items-center justify-center ">
          <HomemaxImage OKCount={OKCount} />
        </div>
        {/* ユーザーの送信したメッセージ */}
        {isMessageSent && (
          <div className=" basis-1/3 flex justify-center ">
            <UserMessageBubble message={userMessage} />
          </div>
        )}
      </div>
      {/* メッセージ送信フォーム */}
      <div className="my-4 flex items-center justify-center h-1/4">
        <MessageForm onSend={handleSend} isMessageSent={isMessageSent} setIsMessageSent={setIsMessageSent} OKCount={OKCount} setOKCount={setOKCount} />
      </div>
    </div>
  )
}

export default Home
