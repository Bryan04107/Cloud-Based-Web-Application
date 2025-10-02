"use client";

import { useEffect, useState, useRef } from 'react';

const themeMap = new Map<string, string>([
  ['Light', 'light'],
  ['Dark', 'dark'],
  ['Blue', 'blue'],
  ['Red', 'red'],
  ['Green', 'green'],
  ['Contrast', 'contrast'],
  ['System', 'system'],
]);

const themeColors = new Map<string, string[]>([
  ['light', ['bg-[#fff]', 'bg-[#e4e4e7]', 'bg-[#e4e4e7]', 'bg-[#f4f4f5]', 'bg-[#27272a]']],
  ['dark', ['bg-[#000]', 'bg-[#27272a]', 'bg-[#27272a]', 'bg-[#18181b]', 'bg-[#d4d4d8]']],
  ['blue', ['bg-[#0c2d48]', 'bg-[#145da0]', 'bg-[#145da0]', 'bg-[#2e8bc0]', 'bg-[#b1d4e0]']],
  ['red', ['bg-[#fdb750]', 'bg-[#FD7F20]', 'bg-[#fc2e20]', 'bg-[#FD7F20]', 'bg-[#010100]']],
  ['green', ['bg-[#ecf87f]', 'bg-[#3d550c]', 'bg-[#3d550c]', 'bg-[#81b622]', 'bg-[#59981a]']],
  ['contrast', ['bg-[#1c1c1c]', 'bg-[#8900ff]', 'bg-[#8900ff]', 'bg-[#ab4cff]', 'bg-[#ffffff]']],
]);

export default function ThemeSelector() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [animateOut, setAnimateOut] = useState(false);
  const [systemThemePreference, setSystemThemePreference] = useState('light');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemThemePreference(mediaQuery.matches ? 'Dark' : 'Light');
    
    const handleSystemChange = (e: MediaQueryListEvent) => {
      setSystemThemePreference(e.matches ? 'Dark' : 'Light');
      if (localStorage.getItem('theme') === 'system') {
        document.documentElement.className = e.matches ? 'dark' : 'light';
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = mediaQuery.matches;
    const initialSelection = savedTheme || 'system';
    
    let initialClass = initialSelection;
    if (initialSelection === 'system') {
      initialClass = prefersDark ? 'dark' : 'light';
    }
    document.documentElement.className = initialClass;
    setSelectedTheme(initialSelection);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (showMenu) {
          setAnimateOut(true);
          setTimeout(() => setShowMenu(false), 200);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleScroll = () => {
      if (showMenu) {
        setAnimateOut(true);
        setTimeout(() => setShowMenu(false), 200);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [showMenu]);

  const changeTheme = (themeName: string) => {
    let finalClass = themeName;
    
    if (themeName === 'system') {
      finalClass = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem('theme', themeName);
    } else {
      localStorage.setItem('theme', themeName);
    }
    
    document.documentElement.className = finalClass;
    setSelectedTheme(themeName);
    setAnimateOut(true);
    setTimeout(() => setShowMenu(false), 200);
  };

  const toggleMenu = () => {
    if (showMenu) {
      setAnimateOut(true);
      setTimeout(() => setShowMenu(false), 200);
    } else {
      setAnimateOut(false);
      setShowMenu(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="w-7 h-7 mx-2 rounded-full outline-2 outline-primary cursor-pointer translate-y-0.5"
      >
        <div
          className="-translate-y-[0.3rem] -translate-x-0.5"
          style={{ fontSize: '1.5rem' }}>
          🎨
        </div>
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          className={`
            absolute top-10 right-0 w-50 rounded-lg outline-2 outline-primary bg-background shadow-xl z-4
            ${animateOut ? 'animate-fade-out-scale-down' : 'animate-fade-in-scale-up'}
          `}
        >
          <ul>
            {Array.from(themeMap.entries()).map(([name, theme]) => (
              <li key={theme}>
                <button
                  onClick={() => changeTheme(theme)}
                  className={`
                    flex items-center justify-between w-full px-4 py-2 text-left text-md text-primary hover:bg-hover 
                    ${selectedTheme === theme ? 'bg-button' : ''}
                  `}
                >
                  <span>{name}</span>
                  <div className="flex space-x-1.5">
                    {theme === 'system' ? (
                      <span className="text-sm text-primary">({systemThemePreference})</span>
                    ) : (
                      themeColors.get(theme)?.map((color, index) => (
                        <div key={index} className={`w-3 h-5 outline-2 outline-primary rounded-sm ${color}`}></div>
                      ))
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}