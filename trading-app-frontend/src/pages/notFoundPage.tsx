import  { FC , useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderLogoComponent from '../components/headerLogo';



// --- SVG Icon Components ---

// --- Main Component ---
const NotFoundPage: FC = () => {
    const [bgOffset, setBgOffset] = useState<number>(0);
    // Parallax effect to match other pages
    useEffect(() => {
        const handleScroll = () => {
            setBgOffset(window.pageYOffset * 0.1);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-[#0a0a0a] text-gray-200 font-['Inter',_sans_serif] antialiased overflow-x-hidden min-h-screen">
            <style>{`
                @keyframes float-symbols {
                    0% { transform: translateY(10vh) rotate(0deg); opacity: 0; }
                    25% { opacity: 0.1; }
                    75% { opacity: 0.1; }
                    100% { transform: translateY(-100vh) rotate(20deg); opacity: 0; }
                }
                .floating-symbol { animation: float-symbols 25s linear infinite; }
                .button-glow {
                    box-shadow: 0 0 5px theme(colors.amber.400), 0 0 10px theme(colors.amber.400);
                }
            `}</style>

            {/* Background Image & Overlay - Matching Theme */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop')",
                        transform: `translateY(${bgOffset}px)`
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
                
                {/* Floating Background Symbols - Matching Theme */}
                {['RELIANCE', 'TCS', 'HDFCBANK'].map((symbol, i) => (
                    <span key={symbol} className="floating-symbol absolute text-white/5 font-bold text-4xl md:text-6xl" style={{
                        left: `${15 + i * 35}%`,
                        animationDelay: `${i * 5}s`,
                    }}>{symbol}</span>
                ))}
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header - Matching Theme */}
                <header className="py-6 px-4 md:px-8">
                 <HeaderLogoComponent windowLocation='/'/>
                </header>

                <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-[10rem] md:text-[18rem] lg:text-[22rem] font-extrabold text-amber-400 leading-none">404</h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">Page Not Found</h2>
                    <p className="text-gray-400 mt-4 max-w-md">
                        Sorry, the page you are looking for does not exist. It might have been moved or deleted.
                    </p>
                    <Link
                        to="/" 
                        className="mt-8 bg-amber-400 text-black font-bold px-8 py-3 rounded-lg hover:bg-amber-300 transition-all duration-300 hover:scale-105 transform shadow-lg button-glow"
                    >
                        Go to Homepage
                    </Link>
                </main>
                
                <footer className="py-8 px-4 md:px-8">
                    <div className="container mx-auto text-center text-gray-500">
                        <p className="text-sm">&copy; {new Date().getFullYear()} VyaparTrade. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default NotFoundPage;

