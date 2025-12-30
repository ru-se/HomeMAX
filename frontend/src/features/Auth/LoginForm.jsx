
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext'; // Context Import

const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth(); // Use Login from Context

  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  })
  const [error, setError] = useState('')
  const hasRun = useRef(false);

  // サインアップ時に渡されたメッセージなどの処理（そのまま維持）
  useEffect(() => {
    if (location.state && location.state.signupSuccess) {
      if (hasRun.current) return;
      hasRun.current = true;
      toast(location.state.signupSuccess, {
        style: { background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)' }
      });

      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location, navigate])

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
      // Context経由でログイン
      const result = await login(loginData.identifier, loginData.password);

      if (result.success) {
        navigate('/home', {
          state: {
            signupSuccess: [
              'ログインしたあなた、今日もこの世界に確かに存在しています！',
              '名前を入力したあなた、その一行がこの物語の主役の証！',
              'パスワードをしっかり入力できたあなた、セキュリティも気持ちも完璧です！'
            ]
          }
        })
      } else {
        setError(result.error || 'ログインに失敗しました');
      }
    } catch (err) {
      setError('通信エラーが発生しました')
    }
  }

  return (
    <div className="flex min-h-screen bg-white text-center font-kiwi-maru justify-center">
      <div className="w-2/5 my-10 mx-10 bg-white rounded shadow-xl/20">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          limit={5}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
        <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6 mx-auto'>

          <h2 className="text-8xl mb-20 mt-10">ログイン</h2>
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex flex-col">
            <div className="flex flex-row items-center mb-10">
              <label htmlFor="identifier" className="w-60">ユーザー名orメールアドレス</label>
              <input
                type="text"
                id='identifier'
                name='identifier'
                value={loginData.identifier}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder='ユーザー名orメールアドレス'
                className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1" />
            </div>

            <div className="flex flex-row items-center mb-10">
              <label htmlFor="password" className="w-60">パスワード</label>
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
