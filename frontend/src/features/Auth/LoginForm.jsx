import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginData.identifier, // バックエンドはusernameで受け取る
          password: loginData.password,
        }),
        credentials: 'include', // セッションを使う場合
      })
      const data = await response.json()
      if (response.ok) {
        navigate('/home')
      } else {
        setError(data.message || 'ログインに失敗しました')
      }
    } catch (err) {
      setError('通信エラーが発生しました')
    }
  }

  return (
    <div className="min-h-screen bg-white text-center pt-38 font-kiwi-maru">
      <form onSubmit={handleSubmit}>
        <h2 className="text-8xl">ログイン</h2>
        <div className="">
          <label htmlFor="identifier" className="">ユーザー名orメールアドレス</label>
          <input
            type="text"
            id='identifier'
            name='identifier'
            value={loginData.identifier}
            onChange={handleChange}
            required
            autoComplete="username"
            placeholder='ユーザー名orメールアドレス'
            className="border "
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id='password'
            name='password'
            value={loginData.password}
            onChange={handleChange}
            required
            autoComplete="password"
            placeholder='パスワード'
          />
        </div>
        <button type="submit">
          ログイン
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  )
}

export default LoginForm