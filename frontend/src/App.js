import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Auth from './components/Auth';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ExcelUpload = React.lazy(() => import('./components/ExcelUpload'));
const DataMapping = React.lazy(() => import('./components/DataMapping'));
const ChartDisplay = React.lazy(() => import('./components/ChartDisplay'));
const UploadHistory = React.lazy(() => import('./components/UploadHistory'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));

// Icons for navigation
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('user');

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
    // Retrieve role from localStorage or default to 'user'
    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setUserRole('user');
    // Clear localStorage on logout
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  };

  // Check if user is already logged in on app start
  React.useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    const role = localStorage.getItem('userRole') || 'user';
    if (currentUser) {
      setIsAuthenticated(true);
      setUsername(currentUser);
      setUserRole(role);
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
          } />
          <Route path="/auth" element={
            <Auth onLogin={handleLogin} onLogout={handleLogout} isAuthenticated={isAuthenticated} onAdminLogin={handleLogin} />
          } />
          <Route path="/dashboard/*" element={
            isAuthenticated ? <DashboardApp username={username} userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/auth" replace />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

  function DashboardApp({ username, userRole, onLogout }) {
    const { isDarkMode, toggleTheme } = useTheme();
    const { i18n, t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hideLabel, setHideLabel] = useState(false);
    const [selectedNav, setSelectedNav] = useState(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { to: '/dashboard', icon: HomeIcon, label: t('Home') },
    { to: '/dashboard/upload', icon: UploadIcon, label: t('Upload') },
    { to: '/dashboard/charts', icon: ChartIcon, label: t('Charts') },
    { to: '/dashboard/history', icon: HistoryIcon, label: t('History') }
  ];

  // Mobile bottom tab navigation items
  const mobileNavItems = [
    // Removed main page button to avoid extra button on main page in mobile nav bar
    // { to: '/dashboard', icon: HomeIcon, label: t('Home') },
    { to: '/dashboard/upload', icon: UploadIcon, label: t('Upload') },
    { to: '/dashboard/charts', icon: ChartIcon, label: t('Charts') },
    { to: '/dashboard/history', icon: HistoryIcon, label: t('History') }
  ];

  return (
    <div className={`min-h-screen bg-cyber-bg text-cyber-text flex font-cyber-body transition-all duration-500 relative overflow-hidden`}>
      {/* 🚀 FUTURISTIC BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-bg via-cyber-surface to-cyber-bg opacity-90"></div>
        <div className="particles-container">
          <div className="particle animate-cyber-particle-odd"></div>
          <div className="particle animate-cyber-particle-even"></div>
          <div className="particle animate-cyber-particle-odd" style={{left: '20%', animationDelay: '2s'}}></div>
          <div className="particle animate-cyber-particle-even" style={{left: '60%', animationDelay: '4s'}}></div>
          <div className="particle animate-cyber-particle-odd" style={{left: '80%', animationDelay: '6s'}}></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* 🚀 CYBERPUNK HEADER - MOBILE RESPONSIVE */}
        <header className="bg-cyber-surface/80 backdrop-blur-cyber border-b border-cyber-primary/30 px-3 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-4 shadow-cyber-electric hover:shadow-cyber-glow transition-all duration-300 ease-out relative overflow-hidden">
          {/* Scan Line Effect */}
          <div className="absolute inset-0 animate-cyber-scan opacity-20"></div>

          <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
              {/* 🚀 CYBERPUNK LOGO SECTION - MOBILE OPTIMIZED */}
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 group flex-shrink-0 min-w-0">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent rounded-xl items-center justify-center hover:scale-110 shadow-cyber-glow transition-all duration-300 animate-cyber-pulse flex-shrink-0 ${hideLabel ? 'hidden' : 'flex'}`}>
                  <span className="text-cyber-text font-cyber-header font-bold text-sm sm:text-lg lg:text-xl text-cyber-primary">XL</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-cyber-header font-bold text-cyber-primary group-hover:text-cyber-accent transition-colors duration-300 text-shadow truncate">
                    {!hideLabel ? (
                      <>
                        <span className="hidden sm:inline">Excel Analytics Platform</span>
                        <span className="sm:hidden">XL Analytics</span>
                      </>
                    ) : null}
                  </h1>
                  <p className="text-xs sm:text-sm text-cyber-text-secondary group-hover:text-cyber-accent transition-colors duration-300 hidden lg:block">
                    Transform your data into insights
                  </p>
                </div>
              </div>

            {/* 🚀 DESKTOP NAVIGATION - Hidden on mobile, shown on md+ */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-shrink-0 z-30">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/50 shadow-cyber-glow'
                        : 'text-cyber-text hover:bg-cyber-surface/60 hover:border-cyber-accent/30 border border-transparent hover:shadow-cyber-electric'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* 🚀 CYBERPUNK ACTIVE INDICATOR */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyber-primary via-cyber-secondary to-cyber-accent shadow-cyber-electric"></div>
                      )}

                      {/* 🚀 CYBERPUNK HOVER EFFECT */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-primary/10 via-cyber-secondary/10 to-cyber-accent/10 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>

                      <div className="relative z-10 flex items-center space-x-2">
                        <div className={`transition-all duration-300 ${isActive ? 'text-cyber-primary' : 'text-cyber-text group-hover:text-cyber-accent'}`}>
                          <item.icon />
                        </div>
                        <span className={`font-cyber-body font-medium transition-colors duration-300 text-sm ${isActive ? 'text-cyber-primary' : 'text-cyber-text group-hover:text-cyber-accent'}`}>
                          {item.label}
                        </span>
                      </div>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* 🚀 MOBILE BOTTOM TAB NAVIGATION - Hidden on desktop, shown on mobile */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cyber-surface/90 border-t border-cyber-primary/30 flex justify-around md:hidden py-2">
              {mobileNavItems.map((item) => (
                <button
                  key={item.to}
                  onClick={() => {
                    setIsMobileMenuOpen(true);
                    setSelectedNav(item.to);
                    setHideLabel(true);
                  }}
                  className="flex items-center justify-center text-xs font-cyber-body font-medium transition-colors duration-300 px-4 py-2 rounded-lg min-h-[40px] text-cyber-text hover:text-cyber-accent hover:bg-cyber-surface/60"
                >
                </button>
              ))}
              {/* Dark Mode Toggle Button */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-1.5 rounded-lg bg-cyber-surface/60 hover:bg-cyber-surface/80 text-cyber-accent border border-cyber-primary/30 hover:border-cyber-accent/50 transition-all duration-200 hover:scale-105 hover:shadow-cyber-glow"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center justify-center px-3 py-1 rounded-lg bg-gradient-to-r from-cyber-error to-cyber-warning hover:from-cyber-warning hover:to-cyber-error text-cyber-text text-xs font-cyber-body font-medium transition-all duration-200 hover:scale-105 shadow-cyber-glow hover:shadow-cyber-electric"
                title="Logout"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">×</span>
              </button>
            </nav>

            {/* 🚀 CYBERPUNK CONTROLS - MOBILE OPTIMIZED */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
              {/* Mobile Menu Button - Only on mobile */}
              {/* <button
                onClick={toggleMobileMenu}
                className="md:hidden p-1.5 sm:p-2 rounded-lg bg-cyber-surface/60 hover:bg-cyber-surface/80 text-cyber-accent backdrop-blur-cyber border border-cyber-primary/30 hover:border-cyber-accent/50 transition-all duration-200 hover:scale-105 hover:shadow-cyber-glow"
                title="Toggle Menu"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button> */}

              {/* Language Selector - Hidden on very small screens */}
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="hidden xs:block px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-cyber-body font-medium bg-cyber-surface/60 text-cyber-text border border-cyber-primary/30 backdrop-blur-cyber hover:bg-cyber-surface/80 hover:border-cyber-accent/50 focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:border-cyber-accent transition-all duration-200 hover:shadow-cyber-electric"
              >
                <option value="en">EN</option>
                <option value="hi">हिं</option>
                <option value="fr">FR</option>
              </select>

              {/* Theme Toggle */}
              {/* <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 lg:p-2.5 rounded-lg bg-cyber-surface/60 hover:bg-cyber-surface/80 text-cyber-accent backdrop-blur-cyber border border-cyber-primary/30 hover:border-cyber-accent/50 transition-all duration-200 hover:scale-105 hover:shadow-cyber-glow"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button> */}

              {/* User Menu - Simplified on mobile */}
              <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                <div className="hidden md:flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${userRole === 'admin' ? 'bg-cyber-accent animate-cyber-status' : 'bg-cyber-primary animate-cyber-pulse'}`}></div>
                  <span className="text-xs sm:text-sm font-cyber-body font-medium text-cyber-text-secondary truncate max-w-20 sm:max-w-32">
                    {username}
                  </span>
                </div>
                {/* <button
                  onClick={onLogout}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-cyber-error to-cyber-warning hover:from-cyber-warning hover:to-cyber-error text-cyber-text text-xs sm:text-sm rounded-lg font-cyber-body font-medium transition-all duration-200 hover:scale-105 shadow-cyber-glow hover:shadow-cyber-electric"
                >
                  <span className="hidden sm:inline">{t('Logout')}</span>
                  <span className="sm:hidden">×</span>
                </button> */}
              </div>
            </div>
          </div>
        </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-40 md:hidden">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu}></div>
                <div className="absolute top-0 left-0 right-0 bg-cyber-surface/95 backdrop-blur-cyber border-b border-cyber-primary/30 shadow-cyber-glow">
                  <div className="flex flex-col py-4">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-6 py-3 transition-all duration-300 rounded-lg ${
                            isActive
                              ? 'bg-cyber-primary/20 text-cyber-primary border-r-4 border-cyber-primary shadow-cyber-glow'
                              : 'text-cyber-text hover:bg-cyber-surface/60 hover:text-cyber-accent'
                          }`
                        }
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="w-5 h-5 flex items-center justify-center rounded bg-cyber-surface/50 overflow-hidden">
                          <item.icon />
                        </div>
                        <span className="font-cyber-body font-medium">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                  <div className={`inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}></div>
                  <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Loading...')}</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<ExcelUpload />} />
                <Route
                  path="/charts"
                  element={
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                      <DataMapping />
                      <ChartDisplay />
                    </div>
                  }
                />
                <Route path="/history" element={<UploadHistory />} />
                {userRole === 'admin' && <Route path="/admin" element={<AdminPanel />} />}
                {/* Fallback route to render Dashboard for unmatched routes */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
