import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [status, setStatus] = useState('authenticating');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // URLのハッシュフラグメントからaccess_tokenを取得
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);
                const access_token = params.get('access_token');
                const refresh_token = params.get('refresh_token');

                if (!access_token) {
                    console.error("No access token found in hash");
                    setStatus('error');
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                }

                // バックエンドにトークンを送信してCookieをセット
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/set-session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token, refresh_token }),
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error("Backend session sync failed");
                }

                const data = await res.json();
                console.log("Session sync success", data);

                // 成功したらホームへ
                setStatus('success');
                navigate('/home', { replace: true });

            } catch (err) {
                console.error("Callback error:", err);
                setStatus('error');
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 font-kiwi-maru">
            {status === 'authenticating' && (
                <>
                    <div className="animate-spin h-10 w-10 border-4 border-pink-400 rounded-full border-t-transparent mb-4"></div>
                    <p className="text-gray-500">ログイン処理中...</p>
                </>
            )}
            {status === 'success' && <p className="text-pink-500 text-xl">ログイン成功！</p>}
            {status === 'error' && <p className="text-red-500">ログインに失敗しました。</p>}
        </div>
    );
};

export default AuthCallback;
