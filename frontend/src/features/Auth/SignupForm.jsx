
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const SignupForm = () => {
  const navigate = useNavigate()
  const { signup } = useAuth(); // Use Signup from Context

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
      const result = await signup(signupData.email, signupData.password, signupData.username);

      if (result.success) {
        setSuccess('登録成功！ログインしてください')
        setTimeout(() => {
          navigate('/login', {
            state: { signupSuccess: 'サインアップを完了したあなた、もう新世界の住人です！' }
          })
        }, 1000)
      } else {
        setError(result.error || '登録に失敗しました');
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
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <div className="flex flex-row items-center mb-10">
            <label htmlFor="username" className="w-60">ユーザー名</label>
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

          <div className="flex flex-row items-center mb-10">
            <label htmlFor="email" className="w-60">メールアドレス</label>
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

          <div className="flex flex-row items-center mb-10">
            <label htmlFor="password" className="w-60">パスワード</label>
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



          {/* Social Login Buttons (Google) */}
          <div className="flex flex-col gap-4 mb-8">
            <button
              type="button"
              onClick={() => {
                // バックエンドの認証エンドポイントへリダイレクト
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login/google`;
              }}
              className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
              <span className="text-gray-600 font-bold">Googleで登録</span>
            </button>

            {/* X/Twitter */}
            <button
              type="button"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/login/twitter`;
              }}
              className="flex items-center justify-center gap-2 bg-black border border-black rounded-full px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-white font-bold">Xで登録</span>
            </button>
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">または</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button type='submit' className="rounded-full bg-blue text-white px-16 py-4 font-kiwi-maru hover:bg-blue-dark">サインアップ</button>
        </form>
      </div >
    </div >
  )
}

export default SignupForm