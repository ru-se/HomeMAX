import React, { useState, useEffect } from 'react'
import History_DatePicker from './History_DatePicker'

const HistoryPage = () => {
  const [history, setHistory] = useState([])
  const [userId, setUserId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  // ユーザーID取得
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
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

  const getJSTDateString = (date) => {
    if (!date) return '';
    const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000); // JSTに変換
    return jst.toISOString().split('T')[0];
  };

  // 褒め言葉＋お手紙の履歴取得
  useEffect(() => {
    if (!userId) return
    const endpoint = selectedDate
      ? `${import.meta.env.VITE_API_URL}/api/compliment/history/by-date?user_id=${userId}&date=${getJSTDateString(selectedDate)}`
      : `${import.meta.env.VITE_API_URL}/api/compliment/history?user_id=${userId}`

    fetch(endpoint, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setHistory(Array.isArray(data) ? data : [])
      })
      .catch(err => console.error('履歴取得エラー:', err))
  }, [userId, selectedDate])

  return (
    <div className="min-h-screen bg-white font-kiwi-maru flex flex-col items-center py-16">
      <h2 className="text-6xl mb-12 mt-8 text-center">お手紙と褒め言葉の履歴</h2>
      <div className="mb-8">
        <History_DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-8 mt-6">
        {history.length === 0 ? (
          <div className="text-center text-lg text-gray-500">履歴はまだありません。</div>
        ) : (
          history.map((item, idx) => (
            <div key={item.happiness_id || idx} className="flex flex-col items-end mb-8">
              {/* お手紙（右側・上） */}
              <div className="self-end max-w-xs px-4 py-2 rounded-2xl shadow text-base bg-blue-100 text-right mb-2">
                <div className="font-bold">お手紙</div>
                <div>{item.letter_message}</div>
                <div className="text-xs text-gray-400">{item.letter_date?.slice(0, 10)}</div>
              </div>
              {/* 褒め言葉（左側・下） */}
              <div className="self-start max-w-xs px-4 py-2 rounded-2xl shadow text-base bg-green-100 text-left">
                <div className="font-bold">褒め言葉</div>
                <div>{item.compliment}</div>
                <div className="text-xs text-gray-400">{item.compliment_date?.slice(0, 10)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HistoryPage