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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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

  return  (
    <div className="flex min-h-screen bg-white text-center font-kiwi-maru justify-center">
      <div className="w-2/5 my-10 mx-10 bg-white rounded shadow-xl/20">
        <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6 mx-auto'>

          {/* タイトル */}
          <h2 className="text-8xl mb-20 mt-10">ログイン</h2>
          <div className="flex flex-col">

            {/* ユーザー名orメールアドレス */}
            <div className="flex flex-row items-center mb-10">
              <label htmlFor="identifier" className="w-60">ユーザー名orメールアドレス</label>

              {/*ユーザー名orメールアドレスの入力*/}
              <input
                type="text"
                id='identifier'
                name='identifier'
                value={loginData.identifier}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder='ユーザー名orメールアドレス'
                className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1"/>
            </div>

            {/* パスワード */}
            <div className="flex flex-row items-center mb-10">
              <label htmlFor="password" className="w-60">パスワード</label>
              
              {/*パスワードの入力*/}
              <input
                type="password"
                id='password'
                name='password'
                value={loginData.password}
                onChange={handleChange}
                required
                autoComplete="password"
                placeholder='パスワード'
                className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1"
              />
            </div>
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            className="rounded-full bg-blue text-white px-16 py-4 font-kiwi-maru hover:bg-blue-dark">
            ログイン
          </button>
        </form>
      </div>

    </div>
  )
}

export default LoginForm