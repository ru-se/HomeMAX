import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from '../components/navigation/BottomNav';
import ParticleField from '../components/ParticleField';

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
        <div className="min-h-screen bg-[#fff0f5] pb-28 font-kiwi-maru relative overflow-hidden">
            <ParticleField />

            <div className="relative z-10">
                {/* Header */}
                <div className="p-8 pb-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-[#db2777] mb-4">称号一覧</h1>

                    <div className="max-w-md mx-auto bg-white/60 backdrop-blur rounded-2xl p-4 shadow-sm border border-pink-100">
                        <div className="flex justify-between items-end mb-2 px-2">
                            <span className="text-[#db2777] font-bold">獲得状況</span>
                            <span className="text-[#db2777] font-bold text-xl">
                                {unlockedCount} <span className="text-sm text-gray-400">/ {totalCount}</span>
                            </span>
                        </div>
                        <div className="w-full bg-[#fbcfe8] rounded-full h-3">
                            <div
                                className="bg-[#db2777] rounded-full h-3 transition-all duration-500"
                                style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Achievements Grid */}
                <div className="p-6 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.achievement_id}
                                className={`
                rounded-3xl p-6 border-2 transition-all duration-300
                ${achievement.unlocked
                                        ? 'bg-[#fff5f7] border-dashed border-[#fbcfe8] shadow-lg hover:shadow-xl hover:-translate-y-1'
                                        : 'bg-white/50 border-gray-200 grayscale opacity-80'
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
                                    <p className="text-xs text-[#db2777] text-center font-bold">
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

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Achievements;
