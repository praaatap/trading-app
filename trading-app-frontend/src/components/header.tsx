// src/components/header.tsx

import React, { FC, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    MenuIcon,
    SearchIcon,
    UserCircleIcon,
    CogIcon,
    LogoutIcon,
    ChartBarIcon,
    XIcon
} from "./common/Icons";
import HeaderLogoComponent from "./headerLogo";


// --- Sub-components for better readability ---

const AuthButtons: FC = () => (
    <div className="flex items-center space-x-2">
        <Link to="/create-account" className="text-gray-300 font-medium px-4 py-2 rounded-full text-sm hover:bg-white/10 hover:text-white transition-colors">
            Log In
        </Link>
        <Link to="/create-account" className="bg-amber-400 text-black font-bold px-5 py-2 rounded-full text-sm hover:bg-amber-300 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
            Sign Up
        </Link>
    </div>
);

const ProfileDropdown: FC<{ onLogout: () => void, profileRef: React.RefObject<HTMLDivElement> }> = React.memo(({ onLogout, profileRef }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileRef]);

    return (
        <div className="relative" ref={profileRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center hover:border-amber-400 transition-colors">
                <UserCircleIcon className="w-6 h-6 text-gray-300" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl animate-fade-in-down overflow-hidden">
                    <div className="p-2">
                        <div className="px-3 py-2">
                            <p className="text-sm font-semibold text-white">Pratap Singh</p>
                            <p className="text-xs text-gray-400 truncate">pratap.s@example.com</p>
                        </div>
                        <div className="border-t border-white/10 my-1" />
                        <Link to="/home" className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-colors">
                            <ChartBarIcon className="w-5 h-5 mr-3 text-amber-400" /> Dashboard
                        </Link>
                        <Link to="/settings" className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-colors">
                            <CogIcon className="w-5 h-5 mr-3 text-amber-400" /> Settings
                        </Link>
                        <div className="border-t border-white/10 my-1" />
                        <button onClick={onLogout} className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-md transition-colors">
                            <LogoutIcon className="w-5 h-5 mr-3" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});


// --- Main Header Component ---
const Header: FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("authToken"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <>
            <header className="bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* LEFT SIDE: Logo + Nav */}
                    <div className="flex items-center space-x-4 md:space-x-8">
                        <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center space-x-2 text-white text-xl font-bold">
                            <HeaderLogoComponent windowLocation={isLoggedIn ? "/home" : "/"} />
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-sm">
                            {["Stocks", "Exchanges", "Community"].map((item) => (
                                <a key={item} href="#" className="relative text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full">
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* RIGHT SIDE: Search + Auth/Profile */}
                    <div className="hidden md:flex items-center space-x-3">
                        <div className="relative">
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            <input type="text" placeholder="Search..." className="bg-black/30 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all duration-300 focus:w-56" />
                        </div>
                        {isLoggedIn ? <ProfileDropdown onLogout={handleLogout} profileRef={profileRef} /> : <AuthButtons />}
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white transition-colors">
                            <MenuIcon className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div 
                    className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-[#0a0a0a] border-l border-white/10 shadow-2xl p-6 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white">
                        <XIcon className="w-7 h-7" />
                    </button>
                    
                    <nav className="flex flex-col space-y-4 mt-12">
                        {["Stocks", "Exchanges", "Community"].map(item => (
                            <a key={item} href="#" className="px-3 py-3 rounded-md text-lg font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors">{item}</a>
                        ))}
                    </nav>

                    <div className="border-t border-white/10 mt-6 pt-6">
                        {isLoggedIn ? (
                            <div className="space-y-4">
                                <Link to="/home" className="flex items-center w-full px-3 py-3 text-lg text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-colors">
                                    <ChartBarIcon className="w-5 h-5 mr-4 text-amber-400"/> Dashboard
                                </Link>
                                <Link to="/settings" className="flex items-center w-full px-3 py-3 text-lg text-gray-300 hover:bg-white/10 hover:text-white rounded-md transition-colors">
                                    <CogIcon className="w-5 h-5 mr-4 text-amber-400"/> Settings
                                </Link>
                                <button onClick={handleLogout} className="flex items-center w-full px-3 py-3 text-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-md transition-colors">
                                    <LogoutIcon className="w-5 h-5 mr-4"/> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Link to="/create-account" className="block text-center w-full bg-gray-800 text-white font-semibold px-3 py-3 rounded-lg text-sm hover:bg-gray-700 transition-colors">Log In</Link>
                                <Link to="/create-account" className="block text-center w-full bg-amber-400 text-black font-bold px-3 py-3 rounded-lg text-sm hover:bg-amber-300 transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.2s ease-out;
                }
            `}</style>
        </>
    );
};

export const MemoizedHeader = React.memo(Header);