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