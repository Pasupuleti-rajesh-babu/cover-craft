import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
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
                    <span className="text-sm font-medium text-slate-500 cursor-not-allowed" title="Coming Soon">Pricing</span>
                    {/* <span className="text-sm font-medium text-slate-500 cursor-not-allowed" title="Coming Soon">Sign in</span> */}
                    <Link to="/app">
                        <Button size="sm" className="shadow-indigo-200 shadow-md">Generate</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
