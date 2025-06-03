// スタートページ

import React, { useEffect , useRef} from 'react'
import { useNavigate, } from "react-router-dom"; 
import homeImage from '../assets/home.png'; // 画像をインポート
import { ToastContainer, toast, Slide } from 'react-toastify';
import { FaHome } from 'react-icons/fa';
import { useTasks } from '../contexts/TasksContext';

const Start = () => {

  const navigate = useNavigate()
const hasRun = useRef(false);
  useEffect(() => {
     if (hasRun.current) return;
    hasRun.current = true;
  let called = false;
  if (!called) {
    called = true;
    (async () => {
      try {
        // 起床
        const taskRes1 = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ task_title: "起床" }),
        });
        const taskData1 = await taskRes1.json();
        toast(`起きたあなた、まず一歩踏み出しただけで本当に偉い！えらい！！`, {
          style: { background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)' }
        });

        // パソコン開く
        const taskRes2 = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ task_title: "パソコン開く" }),
        });
        const taskData2 = await taskRes2.json();
        toast(`画面を灯したあなた、今日も世界にアクセスする覚悟ができてるね！すごい！！`, {
          style: { background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)' }
        });

        // パソコン画面開く
        const taskRes3 = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ task_title: "パソコン画面開く" }),
        });
        const taskData3 = await taskRes3.json();
        toast(`パソコンを開いたその瞬間、あなたの冒険がまた始まった！頑張った！！`, {
          style: { background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)' }
        });

        // アプリ起動
        const taskRes4 = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ task_title: "アプリ起動" }),
        });
        const taskData4 = await taskRes4.json();
        toast(`アプリを起動したあなた、その行動が未来につながってる！凄すぎる！！`, {
          style: { background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)' }
        });
      } catch (e) {
        // エラー時は何もしない
      }
    })();
  }
}, [])

  
  return (
    <>
      <div className="min-h-screen bg-white flex justify-center items-center relative overflow-hidden">
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

        {/* 背景の無限スクロール画像 */}
        <div className="absolute z-0">
          <div className="marquee"></div>
        </div>

        <div className="z-10 w-1/2 py-36 bg-white rounded border-1 border-white-dark shadow-lg">
          {/* タイトル */}
          <h1 className="text-8xl text-center font-kiwi-maru">ほめマックス</h1>

          {/* 説明 */}
          <div className="font-kiwi-maru text-center mt-16">
            ようこそ!<br />
            「ほめマックス」へ！<br />
            <br />
            あなたの“がんばり”を全力で肯定してくれるほめマックス。<br />
            日常のこと、仕事のこと、恋愛のこと、悩んでること——<br />
            なんでも話してみてください。<br />
            <br />
            あなたの話に、キャラの「ほめマックス」が全力で、<br />
            愛と勢いとテンションでほめちぎってくれます！
          </div>

          <div className="flex gap-8 justify-center mt-12">
            {/* 緑色のホームボタン */}
            <button
              onClick={() => navigate('/home')}
              className="rounded-full bg-green-500 text-white px-6 py-2 font-kiwi-maru hover:bg-green-700 flex items-center gap-2"
            >
              <FaHome />
              ホームへ
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Start