import React, { FC, useState } from 'react';
import { ChartBarIcon, MenuIcon, SearchIcon } from './common/Icons';
import HeaderLogoComponent from './headerLogo';

const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4 md:space-x-8">
                    <div className="flex items-center space-x-2 text-white text-xl font-bold">
                       <HeaderLogoComponent windowLocation="/" />
                    </div>
                    <nav className="hidden md:flex items-center space-x-6 text-sm">
                        {['Stocks', 'Exchanges', 'Community', 'Products'].map(item => (
                            <a key={item} href="#" className="relative text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full">{item}</a>
                        ))}
                    </nav>
                </div>

                <div className="hidden md:flex items-center space-x-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        <input type="text" placeholder="Search..." className="bg-black/30 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300 focus:w-64 focus:border-amber-400" />
                    </div>
                    <button className="text-gray-300 font-medium px-4 py-2 rounded-full text-sm hover:bg-white/10 hover:text-white transition-colors">Log In</button>
                    <button className="bg-amber-400 text-black font-bold px-5 py-2 rounded-full text-sm hover:bg-amber-300 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">Sign Up</button>
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white transition-colors">
                        <MenuIcon className={`w-7 h-7 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}/>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="container mx-auto p-4 space-y-4">
                      <nav className="flex flex-col space-y-2">
                          {['Stocks', 'Exchanges', 'Community', 'Products'].map(item => (
                              <a key={item} href="#" className="px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors">{item}</a>
                          ))}
                      </nav>
                      <div className="border-t border-gray-700 pt-4 space-y-3">
                          <button className="w-full text-center bg-gray-800 text-white font-semibold px-3 py-3 rounded-lg text-sm hover:bg-gray-700 transition-colors">Log In</button>
                          <button className="w-full text-center bg-amber-400 text-black font-bold px-3 py-3 rounded-lg text-sm hover:bg-amber-300 transition-colors">Sign Up</button>
                      </div>
                </div>
            </div>
        </header>
    );
};

export const MemoizedHeader = React.memo(Header);