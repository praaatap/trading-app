import React, { useState, FC, SVGProps, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Make sure react-router-dom is installed

// --- Type Definitions ---
type FormType = 'signup' | 'signin';

// --- SVG Icon Components ---
const BarChartIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 20V10"/>
        <path d="M18 20V4"/>
        <path d="M6 20V16"/>
    </svg>
);
const ShieldCheckIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);
const ZapIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);
const TrendingUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
    </svg>
);

// --- Main Component ---
const SignUpPage: FC = () => {
    const [formType, setFormType] = useState<FormType>('signup');
    const [bgOffset, setBgOffset] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            setBgOffset(window.pageYOffset * 0.1);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Submitting ${formType} form`);
    };

    return (
        <div className="bg-[#0a0a0a] text-gray-200 font-['Inter',_sans-serif] antialiased overflow-x-hidden min-h-screen">
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

            {/* Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop')",
                        transform: `translateY(${bgOffset}px)`
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]"></div>

                {['RELIANCE', 'TCS', 'HDFCBANK'].map((symbol, i) => (
                    <span key={symbol} className="floating-symbol absolute text-white/5 font-bold text-4xl md:text-6xl" style={{
                        left: `${15 + i * 35}%`,
                        animationDelay: `${i * 5}s`,
                    }}>{symbol}</span>
                ))}
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="py-6 px-4 md:px-8">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link to="/" className="flex items-center text-xl font-bold cursor-pointer">
                            <TrendingUpIcon className="w-6 h-6 mr-2 text-gray-300"/>
                            <span className="text-white">VyaparTrade</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-8 text-gray-400">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
                            <Link to="/markets" className="hover:text-white transition-colors">Markets</Link>
                        </nav>
                    </div>
                </header>

                <main className="flex-grow flex items-center justify-center px-4 py-8">
                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Form */}
                        <div className="bg-black border border-white/10 rounded-xl p-8 md:p-12">
                            <div className="w-full max-w-md mx-auto">
                                {/* Tab Navigation */}
                                <div className="bg-black p-1 rounded-lg flex items-center mb-8 border border-white/10">
                                    <button 
                                        onClick={() => setFormType('signup')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                                            formType === 'signup' 
                                                ? 'bg-amber-400 text-black shadow-lg button-glow' 
                                                : 'text-gray-400 hover:text-white bg-transparent'
                                        }`}
                                    >
                                        Sign Up
                                    </button>
                                    <button 
                                        onClick={() => setFormType('signin')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                                            formType === 'signin' 
                                                ? 'bg-amber-400 text-black shadow-lg button-glow' 
                                                : 'text-gray-400 hover:text-white bg-transparent'
                                        }`}
                                    >
                                        Sign In
                                    </button>
                                </div>

                                <div className="mb-8">
                                    <h1 className="text-3xl font-extrabold text-white mb-2">
                                        {formType === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                                    </h1>
                                    <p className="text-gray-400">
                                        {formType === 'signup' 
                                            ? 'Join the next generation of Indian traders.' 
                                            : 'Sign in to access your portfolio.'}
                                    </p>
                                </div>

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    {formType === 'signup' && (
                                        <div>
                                            <label htmlFor="fullname" className="text-sm font-medium text-gray-400 block mb-2">
                                                Full Name
                                            </label>
                                            <input 
                                                type="text" 
                                                id="fullname" 
                                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition placeholder-gray-500"
                                                placeholder="Ankit Sharma" 
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="email" className="text-sm font-medium text-gray-400 block mb-2">
                                            Email Address
                                        </label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition placeholder-gray-500"
                                            placeholder="you@example.com" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="text-sm font-medium text-gray-400 block mb-2">
                                            Password
                                        </label>
                                        <input 
                                            type="password" 
                                            id="password" 
                                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition placeholder-gray-500"
                                            placeholder="••••••••" 
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full bg-amber-400 text-black font-bold py-3 px-4 rounded-lg hover:bg-amber-300 transition-all duration-300 hover:scale-105 transform shadow-lg button-glow"
                                    >
                                        {formType === 'signup' ? 'Create Account' : 'Sign In'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Side: Features */}
                        <div className="hidden lg:flex flex-col justify-center space-y-8">
                            <div className="flex items-start">
                                <ZapIcon className="w-8 h-8 mr-4 text-amber-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-white text-xl mb-2">Real-time NSE/BSE Data</h3>
                                    <p className="text-gray-400">Lightning-fast quotes and market depth for informed decisions.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <BarChartIcon className="w-8 h-8 mr-4 text-amber-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-white text-xl mb-2">Advanced Charting Tools</h3>
                                    <p className="text-gray-400">Utilize professional-grade indicators and drawing tools.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <ShieldCheckIcon className="w-8 h-8 mr-4 text-amber-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-white text-xl mb-2">Secure and Trusted</h3>
                                    <p className="text-gray-400">Your investments are protected with industry-leading security.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SignUpPage;
