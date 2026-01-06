import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/navigation/BottomNav';
import ParticleField from '../components/ParticleField';
import GyaruFace from '../assets/gyarumax1.png';
import HomemaxNormal from '../assets/homemax_02.png';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center font-kiwi-maru">
                <p className="text-gray-500">ログインしてください</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fff0f5] pb-28 font-kiwi-maru relative overflow-hidden">
            <ParticleField />

            <div className="relative z-10">
                {/* Header */}
                <div className="p-8 pb-4 text-center relative max-w-sm mx-auto">
                    <h1 className="text-3xl md:text-3xl font-black text-[#9C6924] mb-2 relative z-10 inline-block">プロフィール</h1>
                    <img
                        src={GyaruFace}
                        alt="Gyarumax"
                        className="absolute top-0 -right-8 w-16 h-16 transform rotate-12 z-0 opacity-90"
                    />
                    <p className="text-[#9C6924] opacity-80 relative z-10">{user.username}さんのページ</p>
                </div>

                {/* Profile Content */}
                <div className="p-6 max-w-2xl mx-auto">
                    {/* User Info Card */}
                    <div className="bg-[#fff5f7] rounded-3xl p-6 md:p-8 shadow-lg border-2 border-dashed border-[#fbcfe8] relative mb-6 overflow-hidden">
                        <img src={HomemaxNormal} className="absolute -bottom-8 -right-8 w-32 h-32 opacity-20 transform -rotate-12 pointer-events-none" alt="" />
                        <h2 className="text-xl font-black text-[#db2777] mb-4 border-b border-[#fbcfe8] pb-2 relative z-10">会員証</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">ユーザー名</span>
                                <span className="font-bold text-[#db2777] text-lg">{user.username}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">現在のレベル</span>
                                <span className="font-bold text-[#db2777] text-xl">Lv. {user.level}</span>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-600 text-sm">メールアドレス</span>
                                <span className="font-medium text-[#db2777] text-sm">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-white hover:bg-gray-50 text-gray-500 py-4 rounded-2xl font-bold transition-all shadow-sm border border-gray-200"
                        >
                            ログアウト
                        </button>
                    </div>

                    {/* Coming Soon */}
                    <div className="mt-8 text-center">
                        <p className="text-[#db2777] text-xs opacity-60">※ 設定機能は準備中です</p>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Profile;
