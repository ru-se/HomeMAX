import React, { useState } from 'react';
import LetterEditor from './LetterEditor'; // さっき作ったファイル
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

// AIからの返信手紙を表示するコンポーネント
const LetterView = ({ letter, onReset }) => (
  <div className="max-w-2xl mx-auto bg-white p-10 rounded-lg shadow-2xl font-kiwi-maru border-8 border-[#FFF5F5] animate-fade-in-up">
    {/* 見出し */}
    <h2 className="text-3xl text-[#ff8a00] mb-8 font-bold text-center border-b-2 border-dashed border-gray-200 pb-4">
      {letter.title || '親愛なるあなたへ'}
    </h2>
    
    {/* 本文 */}
    <div className="whitespace-pre-wrap leading-loose text-gray-700 text-lg mb-10">
      {letter.compliment}
    </div>
    
    {/* アクションボタン */}
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
      {/* 魔法のリンク機能（実装予定の共有URL） */}
      {letter.share_token && (
        <button 
          onClick={() => {
             const link = `${window.location.origin}/share/${letter.share_token}`;
             navigator.clipboard.writeText(link);
             toast.success("魔法のリンクをコピーしました！家族に送ってみよう✨", {
               position: "top-center"
             });
          }}
          className="bg-blue-400 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-500 transition-colors shadow-md"
        >
          🔗 魔法のリンクをコピー
        </button>
      )}

      <button 
        onClick={onReset}
        className="bg-pink-400 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-500 transition-colors shadow-md"
      >
        💌 もう一度書く
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('editor'); // 'editor' | 'loading' | 'letter'
  const [receivedLetter, setReceivedLetter] = useState(null);

  const handleSendLetter = async (message) => {
    setCurrentView('loading');
    
    try {
      // 前回バックエンドで作った sendLetter API を叩く
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/letter/sendLetter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id: user?.user_id, 
            message: message 
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        // AIからの返信 (data.ai_letter) をセット
        setReceivedLetter(data.ai_letter);
        setCurrentView('letter');
        toast.success("手紙が届きました！");
      } else {
        throw new Error(data.message || "エラーが発生しました");
      }

    } catch (error) {
      console.error(error);
      toast.error("手紙が出せませんでした...もう一度試してね");
      setCurrentView('editor');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] py-10 px-4 font-kiwi-maru">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl text-gray-700 mb-3 tracking-widest">ほめマックスの手紙部屋</h1>
        <p className="text-gray-500 text-lg">あなたの頑張り、手紙にします。</p>
      </div>

      {/* 画面切り替えロジック */}
      {currentView === 'editor' && (
        <LetterEditor onSend={handleSendLetter} isSending={false} />
      )}

      {currentView === 'loading' && (
        <div className="flex flex-col items-center justify-center py-32 animate-pulse">
          <div className="text-6xl mb-6">📮 🕊️</div>
          <div className="text-2xl text-gray-600">ほめマックスが返事を書いています...</div>
        </div>
      )}

      {currentView === 'letter' && receivedLetter && (
        <LetterView 
          letter={receivedLetter} 
          onReset={() => {
            setReceivedLetter(null);
            setCurrentView('editor');
          }} 
        />
      )}
    </div>
  );
};

export default HomePage;
