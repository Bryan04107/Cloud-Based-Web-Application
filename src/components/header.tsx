"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Tabs", href: "/tabs" },
    { name: "Pre-lab Questions", href: "/pre-lab" },
    { name: "Escape Room", href: "/escape-room" },
    { name: "Coding Races", href: "/coding-races" },
  ];

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center mb-2">
        <div></div>
        <div className="text-2xl font-bold">Title</div>
        <div className="text-lg font-semibold">22586532</div>
      </div>

      <div className="flex justify-between items-center">
        <nav className="flex space-x-4">
          {navLinks.map((link, index) => (
            <div key={link.name} className="flex items-center">
              <Link
                href={link.href}
                className={`
                  p-1 rounded-md outline outline-1 transition-colors duration-200
                  ${pathname === link.href ? "outline-white bg-gray-700" : "outline-transparent hover:text-gray-400"}
                `}
              >
                {link.name}
              </Link>
              {index < navLinks.length - 1 && <span className="text-white ml-4">|</span>}
            </div>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <div className="cursor-pointer">
            <div className="space-y-1">
              <div className="w-6 h-1 bg-white"></div>
              <div className="w-6 h-1 bg-white"></div>
              <div className="w-6 h-1 bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}