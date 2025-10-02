"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface HamburgerMenuProps {
  pathname: string;
  navLinks: { name: string; href: string }[];
  aboutLink: { name: string; href: string };
}

export default function HamburgerMenu({ pathname, navLinks, aboutLink }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
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
      <div className="cursor-pointer" onClick={toggleMenu}>
        <div className="space-y-1">
          <div className={`w-6 h-1 bg-primary`}></div>
          <div className={`w-6 h-1 bg-primary`}></div>
          <div className={`w-6 h-1 bg-primary`}></div>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-screen min-w-50 w-1/5 bg-background text-primary shadow-lg z-4 transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        onClick={(e) => { if (e.target === e.currentTarget) toggleMenu() }}
      >
        <div className="flex justify-end p-4">
          <div className="cursor-pointer mt-[3.33rem]" onClick={toggleMenu}>
            <div className="space-y-1">
              <div className={`w-7 h-1 bg-primary rotate-45 translate-y-2`}></div>
              <div className={`w-7 h-1 bg-primary opacity-0`}></div>
              <div className={`w-7 h-1 bg-primary -rotate-45 -translate-y-2`}></div>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-col text-left border-t-2 border-primary">
          {navLinks.map(link => (
            <li key={link.name} className="list-none border-b-2 border-primary" onClick={toggleMenu}>
              <Link
                href={link.href}
                className={`
                  block w-full text-xl font-bold p-4 
                  ${pathname === link.href ? "bg-button" : "hover:bg-hover"}
                `}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="list-none border-b-2 border-primary" onClick={toggleMenu}>
            <Link
              href={aboutLink.href}
              className={`
                block w-full text-xl font-bold p-4 
                ${pathname === aboutLink.href ? "bg-button" : "hover:bg-hover"}
              `}
            >
              {aboutLink.name}
            </Link>
          </li>
        </nav>
      </div>
    </div>
  );
}