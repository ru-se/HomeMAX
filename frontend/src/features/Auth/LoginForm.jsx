// ログインフォーム

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {

  //ページ遷移を行うための関数を取得
  const navigate = useNavigate()

  // ログインデータの状態を管理するためのuseStateフックを使用
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  })

  // フォームの変更を処理する関数
  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  // フォームの送信を処理する関数
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login data submitted:', loginData)
    // サーバーにデータを送信する処理をここに追加
    // 例: identifier がユーザー名かメールアドレスかをバックエンドで判別

    // ログイン成功後にホームページに遷移
    navigate('/home')
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
            className="border "/>
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
        <button
          type="submit">
          ログイン
        </button>
      </form>
    </div>
  )
}

export default LoginForm