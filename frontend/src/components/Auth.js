import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Auth({ onLogin, onLogout, isAuthenticated, onAdminLogin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock JWT auth functions
  const mockJWTLogin = async (username, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (!username || !password) {
      throw new Error(t('Please fill in all fields'));
    }

    // Admin login check
    if (username === 'admin69@gmail.com' && password === 'admin@69') {
      const token = 'mock-jwt-admin-token-' + Date.now();
      localStorage.setItem('authToken', token);
      return { token, user: { username, role: 'admin' } };
    }

    // Regular user login
    if (username && password) {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('authToken', token);
      return { token, user: { username, role: 'user' } };
    }

    throw new Error(t('Invalid credentials'));
  };

  const mockJWTRegister = async (username, password, email, fullName) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!username || !password || !email || !fullName) {
      throw new Error(t('Please fill in all fields'));
    }

    // Basic email validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(t('Please enter a valid email address'));
    }

    // Password strength check
    if (password.length < 6) {
      throw new Error(t('Password must be at least 6 characters long'));
    }

    // Mock successful registration - store user data
    const userData = { username, email, fullName, role: 'user' };
    localStorage.setItem('registeredUser', JSON.stringify(userData));

    return { message: t('User registered successfully!'), user: userData };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await mockJWTLogin(username, password);

      if (result.user.role === 'admin') {
        onAdminLogin();
      } else {
        onLogin(result.user.username);
      }

      // Store user data
      localStorage.setItem('currentUser', result.user.username);
      localStorage.setItem('userRole', result.user.role);

      // Redirect based on role
      if (result.user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerPassword !== registerConfirmPassword) {
      setError(t('Passwords do not match'));
      setIsLoading(false);
      return;
    }

    try {
      const result = await mockJWTRegister(registerUsername, registerPassword, registerEmail, registerFullName);
      setError(t('User registered successfully! Auto-login in progress...'));

      // Auto-login after successful registration
      setTimeout(async () => {
        try {
          const loginResult = await mockJWTLogin(registerUsername, registerPassword);

          if (loginResult.user.role === 'admin') {
            onAdminLogin();
          } else {
            onLogin(loginResult.user.username);
          }

          // Store user data
          localStorage.setItem('currentUser', loginResult.user.username);
          localStorage.setItem('userRole', loginResult.user.role);

          // Redirect based on role
          if (loginResult.user.role === 'admin') {
            navigate('/dashboard/admin');
          } else {
            navigate('/dashboard');
          }
        } catch (loginErr) {
          setError(t('Registration successful, but login failed. Please try logging in manually.'));
          setIsRegistering(false);
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    onLogout();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 0 3px rgba(251, 191, 36, 0.3)" },
    blur: { scale: 1, boxShadow: "0 0 0 0px rgba(251, 191, 36, 0)" }
  };

  if (isAuthenticated) {
    return (
      <motion.div
        className="auth-logged-in min-h-screen bg-cyber-bg flex items-center justify-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Cyberpunk Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/20 via-cyber-accent/10 to-cyber-secondary/20"></div>
          <div className="absolute inset-0 animate-cyber-scan opacity-5"></div>
        </div>

        <motion.div
          className="relative bg-cyber-surface/95 backdrop-blur-cyber p-8 rounded-xl border border-cyber-primary/30 shadow-cyber-electric text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Scan Line Effect */}
          <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-xl"></div>

          <motion.h2
            className="text-3xl font-cyber-header font-bold text-cyber-primary mb-4 animate-cyber-pulse"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('Welcome to Excel Analytics Platform')}, {username}!
          </motion.h2>
          <motion.button
            onClick={handleLogout}
            className="bg-cyber-error hover:bg-cyber-error/80 text-cyber-text px-6 py-3 rounded-lg font-cyber-body font-semibold border border-cyber-error/50 hover:border-cyber-error transition-all duration-300 hover:shadow-cyber-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('Logout')}
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="auth-container min-h-screen bg-cyber-bg flex flex-col justify-center items-center text-cyber-text relative overflow-hidden">
      {/* 🚀 ENHANCED CYBERPUNK BACKGROUND EFFECTS */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/20 via-cyber-accent/10 to-cyber-secondary/20"></div>

        {/* Animated scan lines */}
        <div className="absolute inset-0 animate-cyber-scan opacity-5"></div>

        {/* 🚀 ADVANCED FLOATING ORBS */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-cyber-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyber-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 left-40 w-80 h-80 bg-cyber-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* 🚀 CYBERPUNK GRID LINES */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* 🚀 FLOATING PARTICLES */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyber-primary rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* 🚀 ELECTRIC ARC EFFECTS */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-cyber-accent to-transparent rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 3,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {isRegistering ? (
          <motion.div
            key="register"
            className="relative auth-box bg-cyber-surface/95 backdrop-blur-cyber p-8 rounded-xl shadow-cyber-electric w-full max-w-md border border-cyber-primary/30"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Scan Line Effect */}
            <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-xl"></div>

            <motion.h2
              className="text-3xl font-cyber-header font-bold mb-8 text-center text-cyber-primary animate-cyber-pulse"
              variants={itemVariants}
            >
              {t('Register')}
            </motion.h2>

            <form onSubmit={handleRegister} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-cyber-body font-semibold text-cyber-text-secondary" htmlFor="registerUsername">
                  {t('Username')}
                </label>
                <motion.input
                  id="registerUsername"
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  placeholder={t('Enter your username')}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-surface border border-cyber-primary/30 text-cyber-text focus:outline-none focus:border-cyber-accent transition-all duration-300"
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-cyber-body font-semibold text-cyber-text-secondary" htmlFor="registerFullName">
                  {t('Full Name')}
                </label>
                <motion.input
                  id="registerFullName"
                  type="text"
                  value={registerFullName}
                  onChange={(e) => setRegisterFullName(e.target.value)}
                  placeholder={t('Enter your full name')}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-surface border border-cyber-primary/30 text-cyber-text focus:outline-none focus:border-cyber-accent transition-all duration-300"
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-cyber-body font-semibold text-cyber-text-secondary" htmlFor="registerEmail">
                  {t('Email')}
                </label>
                <motion.input
                  id="registerEmail"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder={t('Enter your email')}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-surface border border-cyber-primary/30 text-cyber-text focus:outline-none focus:border-cyber-accent transition-all duration-300"
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-cyber-body font-semibold text-cyber-text-secondary" htmlFor="registerPassword">
                  {t('Password')}
                </label>
                <motion.input
                  id="registerPassword"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder={t('Enter your password')}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-surface border border-cyber-primary/30 text-cyber-text focus:outline-none focus:border-cyber-accent transition-all duration-300"
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-cyber-body font-semibold text-cyber-text-secondary" htmlFor="registerConfirmPassword">
                  {t('Confirm Password')}
                </label>
                <motion.input
                  id="registerConfirmPassword"
                  type="password"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder={t('Confirm your password')}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-surface border border-cyber-primary/30 text-cyber-text focus:outline-none focus:border-cyber-accent transition-all duration-300"
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="text-cyber-error text-center font-cyber-body font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                className="w-full bg-cyber-primary hover:bg-cyber-primary/80 text-cyber-text py-3 font-cyber-body font-bold rounded-lg border border-cyber-primary/50 hover:border-cyber-accent transition-all duration-300 hover:shadow-cyber-glow disabled:opacity-50"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="flex items-center justify-center animate-spin"
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⟳
                  </motion.div>
                ) : (
                  t('Register')
                )}
              </motion.button>
            </form>

            <motion.p
              className="mt-8 text-center text-cyber-text-secondary font-cyber-body font-semibold"
              variants={itemVariants}
            >
              {t('Already have an account?')}{' '}
              <motion.button
                onClick={() => setIsRegistering(false)}
                className="text-cyber-accent hover:text-cyber-accent/80 underline transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('Login here')}
              </motion.button>
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            className="relative auth-box bg-cyber-surface/95 backdrop-blur-cyber p-8 rounded-xl shadow-cyber-electric w-full max-w-md border border-cyber-primary/30"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Scan Line Effect */}
            <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-xl"></div>

            <motion.h2
              className="text-3xl font-cyber-header font-bold mb-8 text-center text-cyber-primary animate-cyber-pulse"
              variants={itemVariants}
            >
              {t('Welcome to Excel Analytics Platform')}
            </motion.h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-cyber-body font-semibold text-cyber-text-secondary" htmlFor="username">
                  {t('Username')}
                </label>
                <motion.input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('Enter your username')}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-surface border border-cyber-primary/30 text-cyber-text focus:outline-none focus:border-cyber-accent transition-all duration-300"
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block mb-2 font-cyber-body font-semibold text-cyber-text-secondary" htmlFor="password">
                  {t('Password')}
                </label>
                <motion.input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('Enter your password')}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-surface border border-cyber-primary/30 text-cyber-text focus:outline-none focus:border-cyber-accent transition-all duration-300"
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="text-cyber-error text-center font-cyber-body font-semibold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                className="w-full bg-cyber-primary hover:bg-cyber-primary/80 text-cyber-text py-3 font-cyber-body font-bold rounded-lg border border-cyber-primary/50 hover:border-cyber-accent transition-all duration-300 hover:shadow-cyber-glow disabled:opacity-50"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="flex items-center justify-center animate-spin"
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⟳
                  </motion.div>
                ) : (
                  t('Sign In')
                )}
              </motion.button>
            </form>

            <motion.p
              className="mt-8 text-center text-cyber-text-secondary font-cyber-body font-semibold"
              variants={itemVariants}
            >
              {t("Don't have an account?")}{' '}
              <motion.button
                onClick={() => setIsRegistering(true)}
                className="text-cyber-accent hover:text-cyber-accent/80 underline transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('Register here')}
              </motion.button>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Auth;
