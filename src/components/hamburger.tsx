"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface HamburgerMenuProps {
  pathname: string;
  navLinks: { name: string; href: string }[];
}

export default function HamburgerMenu({ pathname, navLinks }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (isOpen) {
      setIsAnimating(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    } else {
      setIsAnimating(true);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAnimating(false);
        setTimeout(() => {
          setIsOpen(false);
        }, 500);
      }
    };

    const handleScroll = () => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  return (
    <div>
      <button 
        className="
          flex rounded-md cursor-pointer
          focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        aria-controls="hamburger-menu"
      >
        <div className="flex-1 space-y-1 p-1.5 rounded-md hover:bg-shade">
          <div className="w-6 h-1 bg-primary"></div>
          <div className="w-6 h-1 bg-primary"></div>
          <div className="w-6 h-1 bg-primary"></div>
        </div>
      </button>

        <div
          ref={menuRef}
          id="hamburger-menu"
          role="menu"
          aria-labelledby="main-navigation"
          className={`
            fixed top-0 right-0 h-screen min-w-50 w-1/5 pr-1 bg-background text-primary shadow-lg z-4 transform transition-transform duration-500 ease-in-out
            ${isAnimating ? 'translate-x-0' : 'translate-x-full'}
          `}
          onClick={(e) => { if (e.target === e.currentTarget) toggleMenu() }}
        >
          {isOpen && (
            <div>
              <div className="mt-[0.1rem] md:mt-[2.32rem] p-3.5 md:p-4 flex justify-end">
                <button
                  onClick={toggleMenu}
                  aria-label="Close navigation menu"
                  className="
                    flex rounded-md cursor-pointer
                    focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast"
                >
                  <div className="flex-1 space-y-1 p-1 py-2 rounded-md hover:bg-shade">
                    <div className="w-7 h-1 bg-primary rotate-45 translate-y-2"></div>
                    <div className="w-7 h-1 bg-primary opacity-0"></div>
                    <div className="w-7 h-1 bg-primary -rotate-45 -translate-y-2"></div>
                  </div>
                </button>
              </div>
              
              <nav aria-label="Hamburger Navigation" className="flex flex-col text-left border-t-2 border-primary">
                <ul className="flex flex-col">
                {navLinks.map(link => (
                  <li key={link.name} className="list-none border-b-2 border-primary" onClick={toggleMenu}>
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className={`
                        block w-full text-xl font-bold p-4 whitespace-nowrap
                        ${pathname === link.href ? "bg-button" : "hover:bg-hover focus:bg-hover"}
                        focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast
                      `}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}</ul>
              </nav>
            </div>
          )}
        </div>
    </div>
  );
}