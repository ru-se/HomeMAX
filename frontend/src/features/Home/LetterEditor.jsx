import React, { useState, useRef } from 'react';
import { useTasks } from '../../contexts/TasksContext';

// 便箋風エディタ
const LetterEditor = ({ onSend, isSending }) => {
  const [text, setText] = useState('');
  const { completeTaskByTitle } = useTasks();
  const hasRun = useRef(false);

  // 一文字打ったら褒める（既存機能の継承）
  const handleInputWord = async () => {
    if (hasRun.current) return;
    hasRun.current = true;
    try {
      completeTaskByTitle("キーボード入力");
    } catch(e) {}
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text); 
    setText('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in-up">
      {/* 便箋エリア */}
      <div 
        className="bg-[#fdfbf7] p-8 rounded-sm shadow-xl relative transform transition-all hover:scale-[1.01]"
        style={{
          backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px)',
          backgroundSize: '100% 2.5rem', 
          lineHeight: '2.5rem',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 日付 */}
        <div className="text-right text-gray-400 font-kiwi-maru mb-6">
          {new Date().toLocaleDateString('ja-JP')}
        </div>

        {/* 入力フォーム */}
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleInputWord();
          }}
          placeholder="最近あったこと、悩んでいること、誰にも言えないこと...&#13;&#10;ほめマックスに手紙で教えてください。"
          className="w-full bg-transparent border-none focus:ring-0 resize-none font-kiwi-maru text-gray-700 text-lg leading-[2.5rem]"
          style={{ minHeight: '300px' }} 
        />
        
        {/* 送信ボタン（ポスト） */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleSend}
            disabled={isSending || !text.trim()}
            className={`
              font-kiwi-maru px-12 py-4 rounded-full text-white text-xl shadow-lg transition-all
              ${isSending 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#FF8E72] to-[#ff7b5a] hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
              }
            `}
          >
            {isSending ? '配達中...' : '手紙をポストへ 📮'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterEditor;
