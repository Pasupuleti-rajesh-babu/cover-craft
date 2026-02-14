import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenTool, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from './Button';

export const Navbar: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    const login = useGoogleLogin({
        onSuccess: tokenResponse => {
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
                .then(res => res.json())
                .then(userInfo => {
                    setUser(userInfo);
                    localStorage.setItem('google_user', JSON.stringify(userInfo));
                });
        },
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('google_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('google_user');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 transition-opacity hover:opacity-80">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                        <PenTool className="h-5 w-5 text-white" />
                    </div>
                    CoverCraft
                </Link>
                <div className="hidden md:flex items-center gap-6">
                    <span className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">Pricing</span>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                {user.picture ? (
                                    <img src={user.picture} alt="Profile" className="h-8 w-8 rounded-full border border-slate-200" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-slate-700">{user.given_name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
                        </div>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => login()}>
                            Sign in with Google
                        </Button>
                    )}

                    <Link to="/app">
                        <Button size="sm" className="shadow-indigo-200 shadow-md">Generate</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
