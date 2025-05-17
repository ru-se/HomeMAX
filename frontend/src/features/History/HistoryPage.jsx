// 会話の履歴ページ

import React, { useState,useEffect } from 'react'
// import {  useNavigate } from 'react-router-dom'
import History_DatePicker from './History_DatePicker'





const HistoryPage = () => {
  const [letters, setLetters] = useState([])
  const [userId, setUserId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  // まず現在のユーザー情報を取得
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
      .catch(err => console.error('ユーザー取得エラー:', err))
  }, [])

  //手紙の取得
  console.log(selectedDate);

  useEffect(() => {
    if (!userId) return
    //日付の有無で接続先変更
    const endpoint = selectedDate
      ? 'http://localhost:8000/letter/selectLetter'
      : 'http://localhost:8000/letter/allLetters'

      //bodyの共通部分作成
      const body = {
        user_id: userId,
      }

      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0] // "YYYY-MM-DD"
        body.date = formattedDate
      }


    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.result)) {
          setLetters(data.result)
        } else if (data.result) {
          setLetters([data.result])
        } else {
          setLetters([])
        }
      })
      .catch(err => console.error('手紙取得エラー:', err))
  }, [userId, selectedDate])

  return (
    
    <div>
      <h2>Letter一覧</h2>
      
      <History_DatePicker
        //今選ばれている日付
        selectedDate={selectedDate}
        //日付が変わったら状態を更新
        setSelectedDate={setSelectedDate}
      />
      <ul>
        {letters.length === 0 ? (
          <li>手紙はまだありません。</li>
        ) : (
          letters.map((letter, idx) => (
            <li key={letter.letter_id || idx}
              className={`flex ${
                //flex justify-start / justify-end	吹き出しを左寄せ or 右寄せ
                idx % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}>
        <div 
        //max-w-xs	吹き出しの最大幅を制限（小さめ）
        //px-4 py-2	吹き出しの内側の余白
        //rounded-2xl	吹き出しの角を丸くする
        //shadow	吹き出しの影
        //text-sm	吹き出しの文字サイズ
        //bg-blue-100	吹き出しの背景色
        //text-left	吹き出しの文字を左寄せ
        //bg-green-100	吹き出しの背景色
        //text-right	吹き出しの文字を右寄せ
        className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
                    idx % 2 === 0
                      ? 'bg-blue-100 text-left'
                      : 'bg-green-100 text-right'
                  }`}
            >
             {letter.message}
           </div>
          </li>
          ))
        )}
      </ul>
      {/* <History_DatePicker /> */}
      

    </div>
  )

}

export default HistoryPage

// const Historypage = ({ message }) => {
//     return (
//       <div className='w-48 h-48 border-2 border-solid'>
//         <div>
//           <p>{message || '生成中...'}</p>
//         </div>
//       </div>
//     )
//   }
  
//   export default HomemaxMessageBubble