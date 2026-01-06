import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HomemaxAnimated from '../components/HomemaxAnimated';
import ParticleField from '../components/ParticleField';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SharedLetter = () => {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reaction Form State
    const [guestName, setGuestName] = useState('');
    const [reactionType, setReactionType] = useState('heart');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReacted, setIsReacted] = useState(false);

    // Fetch Shared Content
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/share/${token}`);
                if (!res.ok) throw new Error('ページが見つかりません');
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [token]);

    const handleReaction = async (e) => {
        e.preventDefault();
        if (!guestName.trim()) return toast.warn("お名前を教えてね！");

        setIsSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/share/${token}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guest_name: guestName,
                    reaction_type: reactionType,
                    message: message
                })
            });
            if (!res.ok) throw new Error('送信に失敗しました');

            setIsReacted(true);
            toast.success("リアクションを届けました！");

            // 効果音などを鳴らす？
        } catch (err) {
            console.error(err);
            toast.error("送信できませんでした...");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 font-kiwi-maru">
            <div className="animate-spin h-10 w-10 border-4 border-pink-400 rounded-full border-t-transparent"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-kiwi-maru p-4 text-center">
            <h1 className="text-2xl font-bold text-gray-500 mb-4">😢 {error}</h1>
            <p className="text-gray-400 mb-8">URLが間違っているか、削除された可能性があります。</p>
            <Link to="/" className="text-pink-500 underline">HomeMAXトップへ</Link>
        </div>
    );

    return (
        <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-pink-50 via-white to-blue-50 relative flex flex-col items-center py-8 font-kiwi-maru">
            <ParticleField />
            <ToastContainer position="top-center" transition={Slide} hideProgressBar autoClose={3000} />

            {/* Header / Branding */}
            <div className="relative z-10 mb-6 text-center">
                <h1 className="text-xl text-gray-400 font-bold mb-2">HomeMAX Letter</h1>
                <div className="w-32 h-32 mx-auto">
                    <HomemaxAnimated mode="ほめマックス" isLoading={false} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-2xl px-4 space-y-8 pb-20">

                {/* 1. User's Letter (Original Message) */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100 transform -rotate-1">
                    <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">
                        <span className="text-xl">✉️</span>
                        <span>{new Date(data.letter.created_at).toLocaleDateString()} のお手紙</span>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                        {data.letter.message}
                    </p>
                </div>

                {/* 2. HomeMAX's Compliment */}
                <div className="bg-[#ffdacc] p-8 rounded-3xl shadow-lg relative animate-bounce-in border-4 border-white/50">
                    <div className="absolute -top-4 -left-2 bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm transform -rotate-6">
                        ほめマックスより
                    </div>
                    <h2 className="text-xl font-bold text-[#9C6924] mb-4 text-center border-b-2 border-dashed border-[#9C6924]/30 pb-2">
                        {data.compliment.title}
                    </h2>
                    <p className="text-gray-800 leading-8 whitespace-pre-wrap">
                        {data.compliment.compliment}
                    </p>
                </div>

                {/* 3. Reaction Section */}
                <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200">
                    <h3 className="text-center text-xl font-bold text-gray-600 mb-6">
                        {isReacted ? "✨ ありがとう！気持ちを届けました ✨" : "💌 リアクションを送る"}
                    </h3>

                    {!isReacted && (
                        <form onSubmit={handleReaction} className="bg-white p-6 rounded-3xl shadow-md max-w-md mx-auto">

                            {/* Name Input */}
                            <div className="mb-4">
                                <label className="block text-gray-500 text-sm font-bold mb-2">お名前 <span className="text-pink-400">*</span></label>
                                <input
                                    type="text"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    placeholder="ニックネームでOK！"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Stamp Selection */}
                            <div className="mb-4">
                                <label className="block text-gray-500 text-sm font-bold mb-2">スタンプ</label>
                                <div className="flex justify-around bg-gray-50 p-3 rounded-xl">
                                    {['heart', 'clap', 'fire', 'cry'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setReactionType(type)}
                                            className={`text-3xl p-2 rounded-lg transition-transform hover:scale-125 ${reactionType === type ? 'bg-white shadow-sm scale-110' : 'opacity-60'}`}
                                        >
                                            {type === 'heart' && '💖'}
                                            {type === 'clap' && '👏'}
                                            {type === 'fire' && '🔥'}
                                            {type === 'cry' && '😭'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="mb-6">
                                <label className="block text-gray-500 text-sm font-bold mb-2">メッセージ <span className="text-gray-300 font-normal">(任意)</span></label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="すごいね！その調子！"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all h-24 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '送信中...' : 'リアクションを送る 🚀'}
                            </button>
                        </form>
                    )}

                    {isReacted && (
                        <div className="text-center animate-bounce mt-4 text-4xl">
                            📮🕊️💨
                        </div>
                    )}
                </div>

            </div>

            {/* Promo Footer */}
            <div className="mt-auto pt-10 pb-4 text-center">
                <Link to="/" className="text-gray-400 text-sm hover:text-pink-400 transition-colors">
                    Powered by HomeMAX
                </Link>
            </div>
        </div>
    );
};

export default SharedLetter;
