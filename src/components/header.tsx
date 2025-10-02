"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import HamburgerMenu from './hamburger';
import ThemeSelector from './theme';

export default function Header() {
 const pathname = usePathname();

 useEffect(() => {
  if (pathname !== '/') {
   localStorage.setItem('lastPage', pathname);
  }
 }, [pathname]);

 const navLinks = [
  { name: "Tabs", href: "/tabs" },
  { name: "Pre-lab Questions", href: "/pre-lab" },
  { name: "Escape Room", href: "/escape-room" },
  { name: "Coding Races", href: "/coding-races" },
 ];

 return (
  <header className="sticky top-0 z-2 bg-background text-primary p-4 shadow-md border-b-2">
   <div className="flex justify-between items-center mb-2">
    <div className="text-2xl font-bold">LTU Moodle Builder</div>
    <div className="text-lg font-semibold">22586532</div>
   </div>

   <div className="flex justify-between items-center">
    <nav className="hidden md:flex space-x-4">
     {navLinks.map((link, index) => (
      <div key={link.name} className="flex items-center">
       <Link
        href={link.href}
        className={`
         p-1 rounded-md outline outline-1 transition-colors duration-250 
         ${pathname === link.href ? "outline-primary bg-button" : "outline-transparent hover:bg-hover"}
        `}
       >
        {link.name}
       </Link>
       {index < navLinks.length - 1 && <span className="text-primary ml-4">
          <div className={`w-[1px] h-6 bg-primary`}></div></span>}
      </div>
     ))}
    </nav>
    <div />
    <div className="flex items-center space-x-4">
     <Link
      href="/about"
      className={`
       p-1 rounded-md outline outline-1 transition-colors duration-250 
       ${pathname === '/about' ? "outline-primary bg-button" : "outline-transparent hover:bg-hover"}
      `}
     >
      About
     </Link>
     <ThemeSelector />
     <div className="flex items-center space-x-4">
      <HamburgerMenu pathname={pathname} navLinks={navLinks} aboutLink={{ name: 'About', href: '/about' }} />
     </div>
    </div>
   </div>
  </header>
 );
}