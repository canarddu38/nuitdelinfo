"use client";
import { useState, useRef, useEffect } from "react";
import logo from '../assets/logo.svg'
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (navRef.current) {
      setHeaderHeight(navRef.current.offsetHeight);
    }
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];
  
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative w-full overflow-visible">
      <nav ref={navRef} className="relative flex justify-between items-center text-base py-3 px-4 md:px-6 lg:px-8 bg-[#0a0a0f]/80 backdrop-blur-sm border-b border-white/10 w-full overflow-x-hidden">
        {/* User Info - Left Side */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <div className="w-10 h-10 md:w-11 md:h-11 items-center justify-center rounded-full overflow-hidden">
            <img
              src={user?.picture || logo}
              alt={user?.name ? `${user.name} avatar` : "Logo"}
              width={48}
              height={48}
              className="rounded-full object-cover w-full h-full"
            />
          </div>

          <div className="hidden sm:flex flex-col justify-center leading-tight">
            <span className="font-bold text-white text-sm md:text-lg">{user?.name || "NAME"}</span>
            <span className="text-xs md:text-sm text-gray-400">{user?.username || "USERNAME"}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex justify-center items-center gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <div
                onClick={() => navigate(link.href)}
                className={`
                  transition-colors duration-300 cursor-pointer
                  ${location.pathname === link.href
                    ? 'text-white underline decoration-2 underline-offset-5'
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {link.label}
              </div>
            </li>
          ))}
          <li>
            <div 
              className="transition-colors duration-300 cursor-pointer text-gray-400 hover:text-white" 
              onClick={handleLogout}
            >
              logout
            </div>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors hover:bg-white/5 z-10"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div 
          className="absolute top-full left-0 right-0 md:hidden z-50"
          style={{
            background: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <ul className="flex flex-col py-4 px-4 gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <div
                  onClick={() => {
                    navigate(link.href);
                    setIsMenuOpen(false);
                  }}
                  className={`
                    transition-colors duration-300 cursor-pointer py-2
                    ${location.pathname === link.href
                      ? 'text-white underline decoration-2 underline-offset-4'
                      : 'text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </div>
              </li>
            ))}
            <li>
              <div 
                className="transition-colors duration-300 cursor-pointer text-gray-400 hover:text-white py-2" 
                onClick={(e) => {
                  handleLogout(e);
                  setIsMenuOpen(false);
                }}
              >
                logout
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}