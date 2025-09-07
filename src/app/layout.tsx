"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { motion } from "framer-motion";
import { Github, Sparkles } from "lucide-react";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <head>
        <title>BugTrail — Live Roleplay</title>
        <meta name="description" content="Ask questions like an agent. The AI plays the customer. Then generate a BugTrail (the trail of steps that led to the bug)." />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased gradient-bg-animated particles-bg font-sans`}
      >
        {/* Enhanced Navigation */}
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-subtle sticky top-0 z-50 border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-18">
              {/* Left side - Logo and nav items */}
              <div className="flex items-center space-x-6 sm:space-x-8">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-xl blur-md opacity-50 -z-10"></div>
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-white">BugTrail</span>
                    <div className="text-xs text-gray-400 font-medium tracking-wider">LIVE ROLEPLAY</div>
                  </div>
                </motion.div>
                
                <div className="hidden sm:flex items-center space-x-6 md:space-x-8">
                  <motion.a 
                    href="#" 
                    className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 relative group"
                    whileHover={{ y: -1 }}
                  >
                    Home
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-orange-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </motion.a>
                  <motion.a 
                    href="#about" 
                    className="text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 relative group"
                    whileHover={{ y: -1 }}
                  >
                    About
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-orange-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </motion.a>
                </div>
              </div>

              {/* Right side - GitHub icon */}
              <div className="flex items-center">
                <motion.a 
                  href="https://github.com/antofon/bugtrail" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 sm:p-3 text-gray-300 hover:text-white transition-all duration-200 rounded-xl glass-subtle hover:glass-strong"
                  aria-label="BugTrail GitHub repository"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Floating decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-orange-400/10 to-pink-500/10 blur-xl"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-xl"
            animate={{ 
              y: [0, 15, 0],
              x: [0, -15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400/10 to-teal-500/10 blur-xl"
            animate={{ 
              y: [0, -10, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 relative z-10">
          {children}
        </main>

        {/* Enhanced Footer */}
        <motion.footer 
          className="glass-subtle border-t border-white/10 mt-20 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">
                © {currentYear} BugTrail. All rights reserved.
              </div>
              <div className="text-xs text-gray-500">
                Crafted with ✨ for better bug reporting
              </div>
            </div>
          </div>
        </motion.footer>
      </body>
    </html>
  );
}
