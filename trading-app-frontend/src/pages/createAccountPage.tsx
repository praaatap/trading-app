
import React, { useState, FC, SVGProps, useEffect, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient"; // Make sure you have created this file

const TrendingUpIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);


// --- Main Component ---
const SignUpPage: FC = () => {
    const [formType, setFormType] = useState<'signup' | 'signin'>("signup");
    const navigate = useNavigate();

    // State for form fields and errors
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // If a user is already logged in, redirect them to the dashboard
    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            navigate("/home");
        }
    }, [navigate]);

    // Handle form submission to the backend
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const endpoint = formType === 'signup' ? '/auth/register' : '/auth/login';
        const payload = formType === 'signup' ? { name, email, password } : { email, password };

        try {
            const response = await apiClient.post(endpoint, payload);
            if (response.data.token) {
                // On success, save token and redirect
                localStorage.setItem('authToken', response.data.token);
                navigate('/home');
            }
        } catch (err: any) {
            // Display any errors from the backend
            const errorMessage = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0a0a0a] text-gray-200 font-['Inter',sans-serif] min-h-screen relative overflow-x-hidden">
            {/* Background and Header remain the same */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop')" }}/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="py-6 px-4 md:px-12">
                     <div className="container mx-auto flex justify-between items-center">
                        <Link to="/" className="flex items-center text-xl font-bold cursor-pointer">
                            <TrendingUpIcon className="w-6 h-6 mr-2 text-amber-400" />
                            <span className="text-white">VyaparTrade</span>
                        </Link>
                     </div>
                </header>

                <main className="flex-grow flex items-center justify-center px-4 py-12">
                    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="bg-black/50 border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
                            <div className="max-w-md mx-auto">
                                {/* Tabs */}
                                <div className="flex rounded-lg bg-black p-1 border border-white/10 mb-8">
                                    {["signup", "signin"].map((type) => (
                                        <button key={type} onClick={() => { setFormType(type as 'signup' | 'signin'); setError(''); }}
                                            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 ${formType === type ? "bg-amber-400 text-black shadow-lg" : "text-gray-400 hover:text-white bg-transparent"}`}>
                                            {type === "signup" ? "Create Account" : "Sign In"}
                                        </button>
                                    ))}
                                </div>
                                <div className="mb-6">
                                    <h1 className="text-3xl font-extrabold text-white mb-2">{formType === "signup" ? "Start Your Trading Journey" : "Welcome Back, Trader"}</h1>
                                    <p className="text-gray-400">{formType === "signup" ? "Join India’s fastest-growing trading platform." : "Sign in to access your portfolio and the markets."}</p>
                                </div>

                                {/* Form */}
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    {formType === "signup" && (
                                        <div>
                                            <label htmlFor="fullname" className="text-sm font-medium text-gray-400 block mb-2">Full Name</label>
                                            <input type="text" id="fullname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Pratap Singh" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="email" className="text-sm font-medium text-gray-400 block mb-2">Email Address</label>
                                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="text-sm font-medium text-gray-400 block mb-2">Password</label>
                                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                    </div>

                                    {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-md text-center">{error}</p>}
                                    
                                    <button type="submit" disabled={isLoading} className="w-full bg-amber-400 text-black font-bold py-3 px-4 rounded-xl hover:bg-amber-300 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-105 transform transition-all shadow-lg">
                                        {isLoading ? 'Processing...' : (formType === "signup" ? "Create Account" : "Sign In")}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Feature Highlights remain the same */}
                        <div className="hidden lg:flex flex-col space-y-8">
                            {/* Your features JSX */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SignUpPage;