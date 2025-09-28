import React, { FC, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, MenuIcon, SearchIcon, UserCircleIcon, CogIcon, LogoutIcon } from './common/Icons';
import HeaderLogoComponent from './headerLogo';

const Header: FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Check login status on mount
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("authToken"));
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const AuthButtons = () => (
         <div className="hidden md:flex items-center space-x-2">
            <Link to="/create-account" className="text-gray-300 font-medium px-4 py-2 rounded-full text-sm hover:bg-white/10 hover:text-white transition-colors">Log In</Link>
            <Link to="/create-account" className="bg-amber-400 text-black font-bold px-5 py-2 rounded-full text-sm hover:bg-amber-300 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">Sign Up</Link>
        </div>
    );

    return (
        <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4 md:space-x-8">
                    <Link to="/" className="flex items-center space-x-2 text-white text-xl font-bold">
                    <HeaderLogoComponent windowLocation='/home' />
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm">
                        {['Stocks', 'Exchanges', 'Community'].map(item => (
                            <a key={item} href="#" className="relative text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full">{item}</a>
                        ))}
                    </nav>
                </div>

                 <div className="flex items-center space-x-3">
                    <div className="relative hidden sm:block">
                        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        <input type="text" placeholder="Search..." className="bg-black/30 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all duration-300 focus:w-56" />
                    </div>
                     <AuthButtons />
                </div>
            </div>
        </header>
    );
};

export const MemoizedHeader = React.memo(Header);