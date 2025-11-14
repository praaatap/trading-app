import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  FC,
  SVGProps,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderLogoComponent from "../components/headerLogo";

// --- Type Definitions ---
interface UseOnScreenOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

interface IndexData {
  name: string;
  value: string;
  change: string;
  up: boolean;
}

// --- Helper Hooks ---

// Hook to trigger animations on scroll/load
const useOnScreen = (
  options: UseOnScreenOptions
): [React.RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [ref, options]);

  return [ref, isVisible];
};

// --- Animated Wrapper Component ---
const AnimatedElement: FC<AnimatedElementProps> = ({
  children,
  className,
  delay = 0,
}) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1, triggerOnce: true });
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- SVG Icon Components (Lucide React placeholders) ---
const TwitterIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9s-1.7-.5-2.8-.7c-.8 2.3-2.3 3.9-2.3 3.9s-1.1-1.1-1.1-2.2c-.3 1.2-1.2 2.2-2.3 2.5s-2.3-.8-2.3-.8s-.3-2.1.2-3.4c-1.3.4-3.3 1.3-3.3 1.3s-1.7-1.4-1.7-3.3c0-2.3 2.3-4.9 2.3-4.9s-1.9.8-1.9 2.3c.7-2.3 2.5-4 2.5-4s1.4.2 2.8.7c.9-1.3 2.3-2.3 2.3-2.3s-.2 1.3.2 2.2c.5-1.1 1.4-2.2 2.8-2.2z" />
  </svg>
);
const LinkedinIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const MinimalistStockLandingPage: FC = () => {
  const [bgOffset, setBgOffset] = useState<number>(0);
  const router = useNavigate();



  useEffect(() => {
    const handleScroll = () => {
      setBgOffset(window.pageYOffset * 0.1); // Adjust multiplier for parallax speed
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const indices: IndexData[] = [
    { name: "SENSEX", value: "75,418.04", change: "+0.31%", up: true },
    { name: "NIFTY 50", value: "22,967.65", change: "+0.33%", up: true },
    { name: "NIFTY BANK", value: "49,281.90", change: "-0.25%", up: false },
  ];

  const handleOpenAccountClick = () => {
    router("/create-account");
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

      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop')",
            transform: `translateY(${bgOffset}px)`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]"></div>

        {/* Floating Background Symbols */}
        {["RELIANCE", "TCS", "HDFCBANK"].map((symbol, i) => (
          <span
            key={symbol}
            className="floating-symbol absolute text-white/5 font-bold text-4xl md:text-6xl"
            style={{
              left: `${15 + i * 35}%`,
              animationDelay: `${i * 5}s`,
            }}
          >
            {symbol}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-6 px-4 md:px-8">
          <div className="container mx-auto flex justify-between items-center">
            <HeaderLogoComponent windowLocation="/"  />
            <nav className="hidden md:flex items-center space-x-8 text-gray-400">
              <Link
                to="/features"
                className="hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                to="/markets"
                className="hover:text-white transition-colors"
              >
                Markets
              </Link>
              <Link
                to="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow flex flex-col justify-center">
          {/* Hero Section */}
          <section className="text-center container mx-auto px-4 py-20">
            <AnimatedElement delay={0}>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Your Gateway to the Indian Market.
              </h1>
            </AnimatedElement>
            <AnimatedElement delay={200}>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                Trade with precision on the NSE & BSE. Access real-time data and
                powerful tools built for the modern Indian investor.
              </p>
            </AnimatedElement>
            <AnimatedElement
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              delay={400}
            >
              <button
                className="bg-amber-400 text-black font-bold w-full sm:w-auto px-8 py-3 rounded-lg hover:bg-amber-300 transition-all duration-300 hover:scale-105 transform hover:shadow-lg hover:button-glow hover:cursor-pointer"
                onClick={handleOpenAccountClick}
              >
                Open Account
              </button>
              <button className="bg-gray-800 text-white font-bold w-full sm:w-auto px-8 py-3 rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 transform hover:cursor-pointer ">
                <Link to='/home' >
                  Browse Markets
                </Link>
              </button>
            </AnimatedElement>
          </section>

          {/* Indices Widgets */}
          <section className="container mx-auto px-4 mt-10 md:mt-16">
            <AnimatedElement
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto"
              delay={600}
            >
              {indices.map((index) => (
                <div
                  key={index.name}
                  className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-lg text-center md:text-left transition-all duration-300 hover:border-white/20 hover:bg-black/30"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400">
                        {index.name}
                      </h3>
                      <p className="text-xl font-bold text-white">
                        {index.value}
                      </p>
                    </div>
                    <p
                      className={`mt-2 md:mt-0 text-md font-semibold ${
                        index.up ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {index.change}
                    </p>
                  </div>
                </div>
              ))}
            </AnimatedElement>
          </section>
        </main>

        <footer className="py-8 px-4 md:px-8 mt-20">
          <div className="container mx-auto text-center text-gray-500">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="hover:text-white transition-colors">
                <TwitterIcon className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <LinkedinIcon className="w-6 h-6" />
              </a>
            </div>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} VyaparTrade. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MinimalistStockLandingPage;
