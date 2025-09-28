import { BookmarkIcon, SearchIcon, MenuIcon } from "lucide-react";
import type { FC } from "react";
import React, { useState } from "react";
import HeaderLogoComponent from "./headerLogo";

export const MemoizedHeader: FC = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authStatus = localStorage.getItem("authToken");
  return (
    <header className="bg-black border-b border-gray-800/80 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-white text-xl font-bold">
              <HeaderLogoComponent windowLocation="/home" />
            </div>
            <nav className="hidden lg:flex items-center space-x-6 text-sm">
              {["Stocks", "Exchanges", "Community", "Products"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="relative text-gray-300 hover:text-white transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <BookmarkIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Watchlist</span>
            </button>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-900/80 border border-gray-700 rounded-full py-2 pl-9 pr-4 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 focus:w-56 focus:border-blue-600"
              />
            </div>
            <button className="text-gray-300 font-semibold px-5 py-2 rounded-full text-sm bg-gray-800/60 hover:bg-gray-700/80 transition-colors">
              Log In
            </button>
            <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-full text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
              Sign Up
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <MenuIcon
                className={`w-7 h-7 transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg transition-all duration-500 ease-in-out overflow-hidden border-b border-gray-800 ${
            isMenuOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="container mx-auto p-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              {["Stocks", "Exchanges", "Community", "Products"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="border-t border-gray-700 pt-4 flex items-center space-x-3">
              {authStatus  ? (
                <div></div>
              ) : (
                <>
                  <button className="w-full text-center bg-gray-800 text-white font-semibold px-3 py-3 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                    Log In
                  </button>
                  <button className="w-full text-center bg-blue-600 text-white font-semibold px-3 py-3 rounded-lg text-sm hover:bg-blue-500 transition-colors">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
