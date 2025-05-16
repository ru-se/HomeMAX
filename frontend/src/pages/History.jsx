import React, { useEffect, useState } from 'react'

const History = () => {
  const [letters, setLetters] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // まず現在のユーザー情報を取得
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

  useEffect(() => {
    if (!userId) return
    fetch('http://localhost:8000/letter/allLetters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user_id: userId })
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
      .catch(err => console.error('Fetchエラー:', err))
  }, [userId])

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