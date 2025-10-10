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
    { name: 'About', href: '/about' }
  ];

  return (
    <header className="sticky top-0 z-2 bg-background text-primary p-4 shadow-md border-b-2">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold whitespace-nowrap md:mb-2">LTU Moodle Builder</div>
        <div className="flex items-center">
          <div className="text-lg font-semibold hidden sm:flex md:pt-1">22586532</div>
          <div className="flex items-center space-x-2 pl-4 md:hidden">
            <ThemeSelector />
            <HamburgerMenu pathname={pathname} navLinks={navLinks} />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <nav role="navigation" aria-label="Main navigation" className="hidden md:flex space-x-4">
          {navLinks.map((link, index) => (
            <div key={link.name} className="flex items-center">
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={`
                  p-1 rounded-md transition-colors duration-250
                  ${pathname === link.href ? "outline outline-1 outline-primary bg-button" : "outline-transparent hover:bg-hover"}
                  focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-contrast focus-visible:outline-offset-4
                `}
              >
                {link.name}
              </Link>
            {index < navLinks.length - 1 && <span className="text-primary ml-4">
              <div className="w-[1px] h-6 bg-primary"></div></span>}
            </div>
          ))}
        </nav>
        <div className="flex items-center hidden md:flex">
          <ThemeSelector />
          <HamburgerMenu pathname={pathname} navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}