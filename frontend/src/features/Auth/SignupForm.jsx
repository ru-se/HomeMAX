import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { ToastContainer, toast, Slide } from 'react-toastify';

const SignupForm = () => {
  const navigate = useNavigate()
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupData({
      ...signupData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess('登録成功！ログインしてください')
        
        setTimeout(() => {
          navigate('/login', {
            state: {signupSuccess: 'サインアップを完了したあなた、もう新世界の住人です！'}
          }) 
          //サインアップ時に通知
        } , 1000)
      } else {
        setError(data.message || '登録に失敗しました')
      }
    } catch (err) {
      setError('通信エラーが発生しました')
    }
  }

  return (
    <div className="flex min-h-screen bg-white text-center font-kiwi-maru justify-center">
      <div className="w-2/5 my-10 mx-10 bg-white rounded shadow-xl/20">
        <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6 mx-auto'>
          <h2 className="text-7xl mb-20 mt-10">サインアップ</h2>

          {/* ユーザー名 */}
          <div className="flex flex-row items-center mb-10">
            <label htmlFor="username" className="w-60">ユーザー名</label>

            {/* ユーザー名の入力 */}
            <input
              type="text"
              id='username'
              name='username'
              value={signupData.username}
              onChange={handleChange}
              required
              autoComplete="name"
              placeholder='ユーザー名'
              className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1"
            />
          </div>

          {/* メールアドレス */}
          <div className="flex flex-row items-center mb-10">
            <label htmlFor="email" className="w-60">メールアドレス</label>

            {/* メールアドレスの入力 */}
            <input
              type="email"
              id='email'
              name='email'
              value={signupData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder='メールアドレス'
              className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1"
            />
          </div>

          {/* パスワード */}
          <div className="flex flex-row items-center mb-10">
            <label htmlFor="password" className="w-60">パスワード</label>

            {/* パスワードの入力 */}
            <input
              type="password"
              id='password'
              name='password'
              value={signupData.password} 
              onChange={handleChange}
              required
              autoComplete="password"
              placeholder='パスワード'
              className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1"
            />
          </div>

          {/* サインボタン */}
          <button type='submit' className="rounded-full bg-blue text-white px-16 py-4 font-kiwi-maru hover:bg-blue-dark">サインアップ</button>
        </form>
      </div>
    </div>
  )
}

export default SignupForm