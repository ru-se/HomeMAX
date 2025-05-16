import React, { useEffect, useState } from 'react'

const History = () => {
  const [letters, setLetters] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/letter/allLetters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user_id: 1 }) // テスト用にuser_id=1
    })
      .then(res => res.json())
      .then(data => {
        console.log('APIレスポンス:', data)

        // 明確に型確認と空チェック
        if (Array.isArray(data.result)) {
          setLetters(data.result)
        } else if (data.result) {
          setLetters([data.result])
        } else {
          setLetters([])
        }
      })
      .catch(err => console.error('Fetchエラー:', err))
  }, [])

  return (
    <div>
      <h2>Letter一覧</h2>
      <ul>
        {letters.length === 0 ? (
          <li>手紙はまだありません。</li>
        ) : (
          letters.map((letter, idx) => (
            <li key={letter.letter_id || idx}>
              {letter.message}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default History
