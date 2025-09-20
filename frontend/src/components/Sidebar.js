import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

// Icons (using simple SVG icons)
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AdminIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function Sidebar({ isOpen, toggleSidebar, userRole }) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const menuItemVariants = {
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const baseMenuItems = [
    { to: '/dashboard', icon: HomeIcon, label: t('Home') },
    { to: '/dashboard/upload', icon: UploadIcon, label: t('Upload') },
    { to: '/dashboard/charts', icon: ChartIcon, label: t('Charts') },
    { to: '/dashboard/history', icon: HistoryIcon, label: t('History') }
  ];

  const adminMenuItem = { to: '/dashboard/admin', icon: AdminIcon, label: t('Admin') };

  const menuItems = userRole === 'admin' ? [...baseMenuItems, adminMenuItem] : baseMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* 🚀 CYBERPUNK SIDEBAR */}
      <motion.div
        className="fixed left-0 top-0 h-full w-64 bg-cyber-surface/90 backdrop-blur-cyber text-cyber-text shadow-cyber-electric border-r border-cyber-primary/30 z-50 lg:relative lg:translate-x-0 relative overflow-hidden"
        variants={sidebarVariants}
        initial={window.innerWidth >= 1024 ? "open" : "closed"}
        animate={window.innerWidth >= 1024 ? "open" : (isOpen ? "open" : "closed")}
      >
        {/* Scan Line Effect */}
        <div className="absolute inset-0 animate-cyber-scan opacity-10 pointer-events-none"></div>
        {/* 🚀 CYBERPUNK HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-primary/30 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent rounded-xl flex items-center justify-center shadow-cyber-glow animate-cyber-pulse">
              <span className="text-cyber-text font-cyber-header font-bold text-lg">XL</span>
            </div>
            <div className="min-w-0">
              <span className="font-cyber-header font-bold text-cyber-primary text-sm">Analytics</span>
              <div className="text-xs text-cyber-text-secondary">Platform</div>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-cyber-surface/60 hover:bg-cyber-surface/80 text-cyber-text border border-cyber-primary/30 hover:border-cyber-accent/50 backdrop-blur-cyber transition-all duration-200 hover:shadow-cyber-glow lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <motion.ul
            className="space-y-2"
            variants={staggerContainer}
            initial="closed"
            animate="open"
          >
            {menuItems.map((item, index) => (
              <motion.li
                key={item.to}
                variants={menuItemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/50 shadow-cyber-glow'
                        : 'text-cyber-text hover:bg-cyber-surface/60 hover:border-cyber-accent/30 border border-transparent'
                    }`
                  }
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  {({ isActive }) => (
                    <>
                      {/* 🚀 CYBERPUNK ACTIVE INDICATOR */}
                      {isActive && (
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyber-primary via-cyber-secondary to-cyber-accent shadow-cyber-electric"
                          layoutId="activeIndicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      {/* 🚀 CYBERPUNK HOVER EFFECT */}
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-primary/10 via-cyber-secondary/10 to-cyber-accent/10"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 0.2 }}
                        transition={{ duration: 0.2 }}
                      />

                      <motion.div
                        className="relative z-10 flex items-center space-x-3"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className={`transition-all duration-300 ${isActive ? 'text-cyber-primary' : 'text-cyber-text group-hover:text-cyber-accent'}`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <item.icon />
                        </motion.div>
                        <span className={`font-cyber-body font-medium transition-colors duration-300 ${isActive ? 'text-cyber-primary' : 'text-cyber-text group-hover:text-cyber-accent'}`}>
                          {item.label}
                        </span>
                      </motion.div>
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* 🚀 CYBERPUNK FOOTER */}
        <div className="p-4 border-t border-cyber-primary/30 relative z-10">
          <p className="text-xs text-cyber-text-secondary font-cyber-body">
            Excel Analytics Platform v1.0
          </p>
          <div className="mt-1 h-px bg-gradient-to-r from-transparent via-cyber-primary/30 to-transparent"></div>
        </div>
      </motion.div>

      {/* 🚀 CYBERPUNK MOBILE TOGGLE */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-cyber-surface/90 hover:bg-cyber-surface text-cyber-text border border-cyber-primary/30 hover:border-cyber-accent/50 backdrop-blur-cyber transition-all duration-200 hover:shadow-cyber-glow hover:scale-105 lg:hidden"
      >
        <MenuIcon />
      </button>
    </>
  );
}

export default Sidebar;
