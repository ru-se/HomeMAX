import React, { useState, useEffect } from 'react'
import History_DatePicker from './History_DatePicker'
import Menu from '../../components/menu/Menu'

const HistoryPage = () => {
  const [history, setHistory] = useState([])
  const [userId, setUserId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  // ユーザーID取得
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
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
      ? `${import.meta.env.VITE_API_BASE_URL}/api/compliment/history/by-date?user_id=${userId}&date=${getJSTDateString(selectedDate)}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/compliment/history?user_id=${userId}`

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
      <h2 className="text-6xl mb-12 mt-8 text-center">ほめほめ日記</h2>
      <div className="mb-8">
        <History_DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-8">
      <div className="relative w-[700px] h-[800px] mx-auto bg-white/90 shadow text-[16px]">
      {/* 赤い縦線 */}
      <div className="absolute left-[45px] top-0 h-full w-[2px] bg-red-400/40"></div>

      {/* 穴 */}
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner top-[10%] z-10"></div>
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner top-[30%] -translate-y-1/2 z-10"></div>
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner bottom-[50%] z-10"></div>
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner bottom-[10%] z-10"></div>
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner bottom-[30%] z-10"></div>

      {/* 罫線 */}
      <div className="absolute top-[40px] left-0 w-full h-[calc(100%-40px)] bg-[repeating-linear-gradient(white_0px,_white_24px,_steelblue_25px)]">
        {/* テキストエリア */}
        <div
          className="absolute top-[25px] left-[55px] right-[10px] bottom-[10px] font-[Indie_Flower] leading-[25px] overflow-y-auto outline-none"
          contentEditable={false} // contentEditableを無効化
          dangerouslySetInnerHTML={{
            __html: history.length === 0
              ? '<div class="text-center text-lg text-gray-500">履歴はまだありません。</div>'
              : history.map((item, idx) => {
                  const letterDate = new Date(item.letter_date).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }); // JSTに変換
                  const complimentDate = new Date(item.compliment_date).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }); // JSTに変換
                  return `
                    <div key="${item.happiness_id || idx}" class="flex flex-col items-end mb-8">
                      <div class="custom-box relative bg-pink">
                        <div class="font-bold pt-4">お手紙</div>
                        <div>${item.letter_message}</div>
                        <div class="text-xs text-gray-400">${letterDate}</div>
                        <div class="before-shape"></div>
                        <div class="after-shape"></div>
                      </div>
                      <div class="custom-box relative self-start mt-4 bg-green">
                        <div class="font-bold pt-4">褒め言葉</div>
                        <div>${item.compliment}</div>
                        <div class="before-shape"></div>
                        <div class="after-shape"></div>
                        <div class="text-xs text-gray-400">${complimentDate}</div>
                      </div>
                    </div>
                  `;
                }).join('')
          }}
        ></div>
        </div>
      </div>
    </div>

      <Menu />
    </div>
  )
}

export default HistoryPage