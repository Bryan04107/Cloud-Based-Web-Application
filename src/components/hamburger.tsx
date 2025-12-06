"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface HamburgerMenuProps {
  pathname: string;
  navLinks: { name: string; href: string }[];
  onMenuOpen?: (isOpen: boolean) => void;
}

export default function HamburgerMenu({ pathname, navLinks, onMenuOpen }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (onMenuOpen) {
      onMenuOpen(isOpen);
    }
    
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      const focusableElements = menuRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select'
      );
      
      if (focusableElements) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
              }
            }
          }
          if (e.key === 'Escape') {
            setIsOpen(false);
          }
        };

        document.addEventListener('keydown', handleTabKey);
        
        setTimeout(() => {
          firstElement?.focus();
        }, 50);

        return () => {
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          document.removeEventListener('keydown', handleTabKey);
        };
      }
    } else {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        triggerRef.current?.focus();
      }
    }
  }, [isOpen, onMenuOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      <button 
        ref={triggerRef}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        className="flex rounded-md cursor-pointer focus:outline-none z-35 relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="space-y-1.5 p-2 rounded-md hover:bg-hover transition-colors">
          <div className="w-6 h-1 bg-primary"></div>
          <div className="w-6 h-1 bg-primary"></div>
          <div className="w-6 h-1 bg-primary"></div>
        </div>
      </button>

      <div 
        className={`
          fixed inset-0 bg-black/10 backdrop-blur-xs z-34 transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        ref={menuRef}
        id="hamburger-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Main Navigation"
        className={`
          fixed top-0 right-0 h-full min-w-64 w-1/4  bg-background border-l border-primary/20 shadow-2xl z-36 
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full pt-20 pl-4 pr-6">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  block w-full text-lg font-bold py-3 px-4 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset
                  ${pathname === link.href 
                    ? "bg-primary text-background shadow-md translate-x-2" 
                    : "text-primary hover:bg-hover hover:translate-x-1"}
                `}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}