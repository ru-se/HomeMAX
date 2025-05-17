// ホームページ

import React, { useState, useEffect } from 'react'
import MessageForm from '../features/Home/MessageForm'
import UserMessageBubble from '../features/Home/UserMessageBubble'
import HomemaxImage from '../features/Home/HomemaxImage'
import HomemaxMessageBubble from '../features/Home/HomemaxMessageBubble'
import NotificationToast from '../components/naturallyTask/NotificationToast'
import Menu from '../components/menu/menu'


const Home = () => {
  const [toastMessage, setToastMessage] = useState(null);

  //入力状態の管理
  const [isInputChange, setIsInputChange] = useState(false)
  
  useEffect(() => {
    // なにか入力したら
    if(isInputChange) {
      setToastMessage('文字入力できてすごい！！');
    }
  }, [isInputChange])
  

  
  const [isMessageSent, setIsMessageSent] = useState(false) 
  const [userMessage, setUserMessage] = React.useState('')
  const [compliment, setCompliment] = useState('')
  const [isLoading, setIsLoading] = useState(false) 
  const [OKCount, setOKCount] = useState(1) 
  const [userId, setUserId] = useState(null)

 useEffect(() => {
    fetch('http://localhost:8000/auth/me', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.user_id) {
          setUserId(data.user.user_id)
        }
      })
  }, [])

const handleSend = async (userMessage) => {

  setUserMessage(userMessage)
  setIsLoading(true)
  setIsMessageSent(false)

  try {
    // 1. レター登録APIにPOST
    const letterRes = await fetch('http://localhost:8000/letter/addLetter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        user_id: userId,
        message: userMessage,
      }),
    })
    const letterData = await letterRes.json()
    if (!letterRes.ok || !letterData.result?.insertId) {
      throw new Error('レター登録に失敗しました')
    }
    const letter_id = letterData.result.insertId

    // 2. 褒め言葉生成APIにPOST
    const response = await fetch('http://localhost:8000/api/compliment/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        letter_id: letter_id,
        letter_message: userMessage,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    setCompliment(data.compliment)
    setIsMessageSent(true)
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    setIsLoading(false)
  }
}
  

  return (
    <div>
      {/* 通知表示 */}
      {toastMessage != null && (
        <NotificationToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
      
      {isMessageSent && (
        <div className='absolute left-0 top-1/2'>
          {/* 褒め言葉を表示 */}
          <HomemaxMessageBubble message={isLoading ? '生成中...' : compliment} />
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
        <MessageForm
          onSend={handleSend}
          isMessageSent={isMessageSent}
          setIsMessageSent={setIsMessageSent}
          OKCount={OKCount}
          setOKCount={setOKCount}
          setIsInputChange={setIsInputChange}
        />
      </div>
    </div>
  )
}

export default Home