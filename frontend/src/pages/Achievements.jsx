import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Achievements = () => {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/achievements`, {
                credentials: 'include'
            });
            const data = await res.json();
            setAchievements(data.achievements || []);
        } catch (err) {
            console.error("Failed to fetch achievements:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 font-kiwi-maru">
                <p className="text-gray-500">読み込み中...</p>
            </div>
        );
    }

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    return (
        <div className="min-h-screen bg-pink-50 font-kiwi-maru pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black mb-2">🏆 称号一覧</h1>
                        <p className="text-lg">
                            {unlockedCount} / {totalCount} 獲得
                        </p>
                        <div className="w-full bg-white/30 rounded-full h-3 mt-3">
                            <div
                                className="bg-white rounded-full h-3 transition-all duration-500"
                                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            console.log('[ACHIEVEMENT] Check button clicked!');
                            try {
                                console.log('[ACHIEVEMENT] Calling API:', `${import.meta.env.VITE_API_BASE_URL}/achievements/check`);
                                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/achievements/check`, {
                                    method: 'POST',
                                    credentials: 'include'
                                });
                                console.log('[ACHIEVEMENT] API response:', res.status, res.ok);
                                const data = await res.json();
                                console.log('[ACHIEVEMENT] Response data:', data);

                                if (res.ok) {
                                    alert(`称号をチェックしました！\n${data.achievements?.length || 0}個の称号を獲得`);
                                    fetchAchievements(); // Reload achievements
                                } else {
                                    alert(`エラー: ${data.error || '不明なエラー'}`);
                                }
                            } catch (err) {
                                console.error('[ACHIEVEMENT] Error:', err);
                                alert('エラーが発生しました: ' + err.message);
                            }
                        }}
                        className="bg-yellow-400 text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors shadow-lg"
                    >
                        🔄 称号をチェック
                    </button>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="p-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement) => (
                        <div
                            key={achievement.achievement_id}
                            className={`
                rounded-2xl p-6 border-2 transition-all duration-300
                ${achievement.unlocked
                                    ? 'bg-white border-pink-300 shadow-lg hover:shadow-xl hover:-translate-y-1'
                                    : 'bg-gray-100 border-gray-300 opacity-60'
                                }
              `}
                        >
                            {/* Icon */}
                            <div className="text-center mb-4">
                                <span
                                    className={`
                    text-6xl inline-block transition-all duration-300
                    ${achievement.unlocked ? 'grayscale-0 animate-bounce-in' : 'grayscale blur-sm'}
                  `}
                                >
                                    {achievement.icon || '🏅'}
                                </span>
                            </div>

                            {/* Name */}
                            <h3 className="text-2xl font-black text-gray-800 text-center mb-2">
                                {achievement.achievement_name}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 text-center text-sm mb-3">
                                {achievement.achievement_description}
                            </p>

                            {/* Unlock Status */}
                            {achievement.unlocked ? (
                                <p className="text-xs text-pink-500 text-center font-bold">
                                    ✅ 獲得済み
                                    {achievement.unlocked_at && (
                                        <span className="block text-gray-400 mt-1">
                                            {new Date(achievement.unlocked_at).toLocaleDateString('ja-JP')}
                                        </span>
                                    )}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-400 text-center">
                                    🔒 未獲得
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Achievements;
