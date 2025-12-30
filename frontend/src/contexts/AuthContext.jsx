
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserLoggedIn = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else if (res.status === 401 || res.status === 403) {
                // セッション切れなどは静かにログアウト状態にする
                setUser(null);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: '通信エラー' };
        }
    };

    const signup = async (email, password, username) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username }),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user); // Signup後、自動ログイン扱いにしても良いが、今回はLoginもしてもらうならsetUserしない手もある
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: '通信エラー' };
        }
    };

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
