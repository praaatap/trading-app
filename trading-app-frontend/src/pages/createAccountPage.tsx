import React, { useState, FC, SVGProps, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- Type Definitions ---
type FormType = 'signup' | 'signin';

// --- SVG Icons ---
const BarChartIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 20V10"/>
        <path d="M18 20V4"/>
        <path d="M6 20V16"/>
    </svg>
);
const ShieldCheckIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);
const ZapIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);
const TrendingUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
    </svg>
);

// --- Main Component ---
const SignUpPage: FC = () => {
    const [formType, setFormType] = useState<FormType>('signup');
    const [bgOffset, setBgOffset] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => setBgOffset(window.pageYOffset * 0.08);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Submitting ${formType} form`);
    };

    return (
        <div className="bg-[#0a0a0a] text-gray-200 font-['Inter',sans-serif] min-h-screen relative overflow-x-hidden">
            {/* Floating Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                    style={{ 
                        backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop')", 
                        transform: `translateY(${bgOffset}px)` 
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="py-6 px-4 md:px-12">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link to="/" className="flex items-center text-xl font-bold cursor-pointer">
                            <TrendingUpIcon className="w-6 h-6 mr-2 text-amber-400"/>
                            <span className="text-white">VyaparTrade</span>
                        </Link>
                        <nav className="hidden md:flex space-x-8 text-gray-400">
                            <Link to="/" className="hover:text-white transition-colors">Home</Link>
                            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
                            <Link to="/markets" className="hover:text-white transition-colors">Markets</Link>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Sign Up / Sign In Form */}
                        <div className="bg-black border border-white/10 rounded-2xl p-10 shadow-xl backdrop-blur-md">
                            <div className="max-w-md mx-auto">
                                {/* Tabs */}
                                <div className="flex rounded-lg bg-black p-1 border border-white/10 mb-8">
                                    {['signup', 'signin'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFormType(type as FormType)}
                                            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
                                                formType === type
                                                    ? 'bg-amber-400 text-black shadow-lg'
                                                    : 'text-gray-400 hover:text-white bg-transparent'
                                            }`}
                                        >
                                            {type === 'signup' ? 'Sign Up' : 'Sign In'}
                                        </button>
                                    ))}
                                </div>

                                {/* Heading */}
                                <div className="mb-6">
                                    <h1 className="text-3xl font-extrabold text-white mb-2">
                                        {formType === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                                    </h1>
                                    <p className="text-gray-400 text-sm">
                                        {formType === 'signup'
                                            ? 'Join India’s next-gen traders.'
                                            : 'Sign in to access your portfolio.'}
                                    </p>
                                </div>

                                {/* Form */}
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    {formType === 'signup' && (
                                        <div>
                                            <label htmlFor="fullname" className="text-sm font-medium text-gray-400 block mb-1">Full Name</label>
                                            <input type="text" id="fullname" placeholder="Ankit Sharma"
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"/>
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="email" className="text-sm font-medium text-gray-400 block mb-1">Email Address</label>
                                        <input type="email" id="email" placeholder="you@example.com"
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"/>
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="text-sm font-medium text-gray-400 block mb-1">Password</label>
                                        <input type="password" id="password" placeholder="••••••••"
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"/>
                                    </div>

                                    <button type="submit" 
                                        className="w-full bg-amber-400 text-black font-bold py-3 px-4 rounded-xl hover:bg-amber-300 hover:scale-105 transform transition-all shadow-lg"
                                    >
                                        {formType === 'signup' ? 'Create Account' : 'Sign In'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Feature Highlights */}
                        <div className="hidden lg:flex flex-col space-y-8">
                            {[{
                                icon: <ZapIcon className="w-8 h-8 mr-4 text-amber-400 mt-1"/>,
                                title: 'Real-time NSE/BSE Data',
                                desc: 'Lightning-fast quotes and market depth for informed decisions.'
                            },{
                                icon: <BarChartIcon className="w-8 h-8 mr-4 text-amber-400 mt-1"/>,
                                title: 'Advanced Charting Tools',
                                desc: 'Professional-grade indicators and drawing tools.'
                            },{
                                icon: <ShieldCheckIcon className="w-8 h-8 mr-4 text-amber-400 mt-1"/>,
                                title: 'Secure & Trusted',
                                desc: 'Your investments are protected with industry-leading security.'
                            }].map((feature, i) => (
                                <div key={i} className="flex items-start">
                                    {feature.icon}
                                    <div>
                                        <h3 className="text-white font-bold text-xl mb-1">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SignUpPage;
