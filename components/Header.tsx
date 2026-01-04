'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { NodeExchangeIcon } from '@/components/icons';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95' : 'bg-slate-900/0'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className={`border rounded-2xl transition-all duration-300 backdrop-blur-md ${
            isScrolled ? 'bg-slate-900/60 border-blue-500/20' : 'bg-slate-900/40 border-blue-500/10'
          }`}>
            <div className="flex justify-center sm:justify-between items-center h-14 sm:h-16 px-3 sm:px-6 relative">
              <a href="/" className="flex items-center gap-2 sm:gap-3">
                <NodeExchangeIcon className="text-blue-500 w-12 h-12 sm:w-12 sm:h-12" />
                <span className="text-lg sm:text-lg font-black tracking-tight">
                  <span className="text-white">Deposit</span>
                  <span className="text-blue-500">.</span>
                  <span className="text-white">now</span>
                </span>
              </a>
              <div className="flex items-center gap-3 sm:gap-8 absolute right-3 sm:relative sm:right-0">
                <a href="/ecosystem" className="text-sm font-medium text-white hover:text-blue-400 transition-colors hidden sm:inline">
                  Ecosystem
                </a>
                <a href="/docs" className="text-sm font-medium text-white hover:text-blue-400 transition-colors hidden sm:inline">
                  API
                </a>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider px-6 h-10 rounded-lg hidden sm:flex">
                  GET STARTED
                </Button>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden w-12 h-12 flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <line x1="6" y1="8" x2="16" y2="8" className={`transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="8" y1="16" x2="18" y2="16" className={`transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/98 backdrop-blur-xl z-[60] sm:hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-blue-500/20">
              <div className="flex items-center gap-2">
                <NodeExchangeIcon className="text-blue-500 w-10 h-10" />
                <span className="text-lg font-black">
                  <span className="text-white">Deposit</span>
                  <span className="text-blue-500">.</span>
                  <span className="text-white">now</span>
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 flex items-center justify-center text-white"
                aria-label="Close menu"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col p-6 space-y-1">
                <a
                  href="/ecosystem"
                  className="text-lg font-semibold text-white hover:text-blue-400 transition-colors py-4 border-b border-blue-500/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ecosystem
                </a>
                <a
                  href="/docs"
                  className="text-lg font-semibold text-white hover:text-blue-400 transition-colors py-4 border-b border-blue-500/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  API Documentation
                </a>
                <div className="pt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider h-14 rounded-xl">
                    GET STARTED
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
