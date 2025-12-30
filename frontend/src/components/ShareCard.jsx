import React from 'react';
import { FaTwitter } from 'react-icons/fa';

const ShareCard = ({ taskName, praise, onClose }) => {
    const textToShare = `【ほめマックス成長記録】\n「${taskName}」を達成しました！\nほめマックス「${praise}」\n\n#ほめマックス #成長記録 #今日のえらい`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-bounce-in border-4 border-yellow-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>

                <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">すごい！</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        <span className="font-bold text-pink-500">{taskName}</span>
                        <br />
                        達成おめでとう！
                    </p>

                    <div className="bg-pink-50 rounded-xl p-4 mb-6 border-2 border-pink-100">
                        <p className="text-gray-500 text-sm mb-1">ほめマックスより</p>
                        <p className="text-xl font-bold text-gray-800">「{praise}」</p>
                    </div>

                    <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-black text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800 transition-transform transform hover:scale-105"
                    >
                        <FaTwitter className="text-xl" />
                        Xで自慢する
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ShareCard;
