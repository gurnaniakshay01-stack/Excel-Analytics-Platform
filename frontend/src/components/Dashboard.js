import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ThreeDChart from './ThreeDChart';

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalFiles: 0,
    activeUsers: 0,
    dataPoints: 0,
    recentUploads: []
  });
  const [aiSummary, setAiSummary] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [currentDataId, setCurrentDataId] = useState(null);
  const chatContainerRef = useRef(null);

  // Get data from Redux store
  const excelData = useSelector((state) => state.data.excelData);

  useEffect(() => {
    if (!excelData || excelData.length === 0) {
      setStats({
        totalFiles: 0,
        activeUsers: 0,
        dataPoints: 0,
        recentUploads: []
      });
      setCurrentDataId(null);
      return;
    }

    // Calculate stats from excel data
    const totalFiles = 1; // Since excelData is a single array
    const dataPoints = excelData.length;

    // Mock active users (in real app, this would come from API)
    const activeUsers = Math.floor(Math.random() * 50) + 10;

    // Get recent uploads (mock data since we only have current excel data)
    const recentUploads = [{
      id: 1,
      name: 'Current Excel File',
      date: new Date().toLocaleDateString(),
      size: `${Math.floor(Math.random() * 100) + 10} KB`,
      status: 'Processed'
    }];

    setStats({
      totalFiles,
      activeUsers,
      dataPoints,
      recentUploads
    });

    // Generate AI summary
    generateAISummary(totalFiles, dataPoints);

    // Set current data ID for AI chat (mock ID for now)
    setCurrentDataId('currentdataid');

  }, [excelData]);

  // Autoscroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isAiTyping]);

  const generateAISummary = (files, points) => {
    setIsTyping(true);
    const summaries = [
      `Your Excel Analytics Platform has processed ${files} files containing ${points} data points. The data shows promising trends for analysis.`,
      `Analysis complete! ${files} files uploaded with ${points} total data points. Ready for visualization and insights.`,
      `Dashboard updated: ${files} files processed, ${points} data points analyzed. Your data is now ready for comprehensive reporting.`,
      `Great progress! ${files} files successfully uploaded with ${points} data points. The platform is optimized for your analytical needs.`,
      `Data processing finished: ${files} files containing ${points} data points are now available for chart generation and export.`
    ];

    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];

    let index = 0;
    const typeWriter = () => {
      if (index < randomSummary.length) {
        setAiSummary(randomSummary.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, 50);
      } else {
        setIsTyping(false);
      }
    };

    setTimeout(typeWriter, 1000);
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || isAiTyping) return;

    const message = userMessage.trim();
    setUserMessage('');

    // Add user message to chat
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMsg]);

    // Show AI typing indicator
    setIsAiTyping(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          dataId: currentDataId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response to chat
        const aiMsg = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.message,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMsg]);
      } else {
        // Add error message
        const errorMsg = {
          id: Date.now() + 1,
          type: 'ai',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
          error: true
        };
        setChatMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Network error. Please check your connection and try again.',
        timestamp: new Date(),
        error: true
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div
      className="relative bg-cyber-surface/95 backdrop-blur-cyber p-6 rounded-2xl border border-cyber-primary/30 shadow-cyber-glow hover:shadow-cyber-glow transition-all duration-500 overflow-hidden group"
      initial={{ opacity: 0, y: 20, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        z: 50,
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)'
      }}
      style={{ perspective: '1000px' }}
    >
      {/* 🚀 CYBERPUNK SCAN LINE EFFECT */}
      <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-2xl"></div>

      {/* 🚀 CYBERPUNK HOLOGRAPHIC OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/5 via-transparent to-cyber-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* 🚀 CYBERPUNK ELECTRIC BORDER */}
      <div className="absolute inset-0 rounded-2xl border border-cyber-primary/50 animate-cyber-pulse"></div>
      <div className="absolute inset-1 rounded-xl border border-cyber-secondary/30 animate-cyber-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="absolute inset-2 rounded-lg border border-cyber-accent/20 animate-cyber-pulse" style={{ animationDelay: '0.4s' }}></div>

      {/* 🚀 CYBERPUNK PARTICLE EFFECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyber-primary rounded-full animate-cyber-particle-odd"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyber-accent rounded-full animate-cyber-particle-even"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyber-secondary rounded-full animate-cyber-particle-odd"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <motion.p
            className="text-sm font-cyber-body font-medium text-cyber-text-secondary mb-2"
            animate={{ color: ['#00ffff', '#ff00ff', '#00ffff'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {title}
          </motion.p>
          <motion.p
            className="text-3xl font-cyber-header font-bold text-cyber-primary animate-cyber-pulse"
            animate={{
              textShadow: [
                '0 0 5px rgba(0, 255, 255, 0.5)',
                '0 0 15px rgba(0, 255, 255, 0.8)',
                '0 0 5px rgba(0, 255, 255, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {value}
          </motion.p>
        </div>

        {/* 🚀 CYBERPUNK ICON WITH GLOW */}
        <motion.div
          className="relative p-4 rounded-xl bg-gradient-to-br from-cyber-primary/20 to-cyber-accent/20 border border-cyber-primary/30 shadow-cyber-glow"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Electric border effect */}
          <div className="absolute inset-0 rounded-xl border border-cyber-secondary/50 animate-cyber-pulse"></div>
          <motion.span
            className="relative z-10 text-2xl block"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {icon}
          </motion.span>
        </motion.div>
      </div>

      {/* 🚀 CYBERPUNK BOTTOM GLOW LINE */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyber-primary via-cyber-accent to-cyber-secondary rounded-b-2xl"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: delay + 0.5, duration: 1 }}
      />
    </motion.div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="space-y-6 sm:space-y-8 lg:space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 dark:from-blue-600 dark:via-purple-700 dark:to-pink-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl hover:shadow-3xl transition-all duration-500"
        variants={itemVariants}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
          <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-white rounded-full translate-y-10"></div>
        </div>

        <div className="relative z-10">
          <motion.h1
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t('Welcome to Excel Analytics Platform')}
          </motion.h1>
          <motion.p
            className="text-blue-100 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Transform your data into insights with powerful analytics and visualizations
          </motion.p>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('Total Files')}
          value={stats.totalFiles}
          icon="📁"
          color="text-blue-600"
          delay={0.1}
        />
        <StatCard
          title={t('Active Users')}
          value={stats.activeUsers}
          icon="👥"
          color="text-green-600"
          delay={0.2}
        />
        <StatCard
          title={t('Data Points')}
          value={stats.dataPoints.toLocaleString()}
          icon="📊"
          color="text-purple-600"
          delay={0.3}
        />
        <StatCard
          title={t('Recent Uploads')}
          value={stats.recentUploads.length}
          icon="📤"
          color="text-orange-600"
          delay={0.4}
        />
      </div>

      {/* 🚀 CYBERPUNK 3D DATA VISUALIZATION */}
      {excelData && excelData.length > 0 && (
        <motion.div
          className="relative bg-cyber-surface/95 backdrop-blur-cyber p-6 rounded-2xl border border-cyber-primary/30 shadow-cyber-glow overflow-hidden"
          variants={itemVariants}
        >
          {/* 🚀 CYBERPUNK SCAN LINE EFFECT */}
          <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-2xl"></div>

          {/* 🚀 CYBERPUNK HOLOGRAPHIC OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/5 via-transparent to-cyber-accent/5 rounded-2xl"></div>

          {/* 🚀 CYBERPUNK ELECTRIC BORDER */}
          <div className="absolute inset-0 rounded-2xl border border-cyber-primary/50 animate-cyber-pulse"></div>
          <div className="absolute inset-1 rounded-xl border border-cyber-secondary/30 animate-cyber-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute inset-2 rounded-lg border border-cyber-accent/20 animate-cyber-pulse" style={{ animationDelay: '0.4s' }}></div>

          <div className="relative z-10">
            <motion.h2
              className="text-2xl font-cyber-header font-bold text-cyber-primary mb-6 flex items-center"
              animate={{
                textShadow: [
                  '0 0 5px rgba(0, 255, 255, 0.5)',
                  '0 0 15px rgba(0, 255, 255, 0.8)',
                  '0 0 5px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="mr-3">📊</span>
              Realtime 3D Data Visualization
            </motion.h2>

            <div className="h-96 w-full">
              <ThreeDChart
                data={excelData}
                xAxis={excelData[0] && excelData[0][0] ? excelData[0][0] : 'Category'}
                yAxis={excelData[0] && excelData[0][1] ? excelData[0][1] : 'Value'}
              />
            </div>

            <motion.div
              className="mt-4 flex items-center justify-between text-sm text-cyber-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center">
                <span className="w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-cyber-pulse"></span>
                Live data visualization with cyberpunk effects
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-cyber-primary rounded-full mr-2"></span>
                  XAxis: {excelData[0] && excelData[0][0] ? excelData[0][0] : 'Category'}
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-cyber-accent rounded-full mr-2"></span>
                  YAxis: {excelData[0] && excelData[0][1] ? excelData[0][1] : 'Value'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* 🚀 CYBERPUNK BOTTOM GLOW LINE */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyber-primary via-cyber-accent to-cyber-secondary rounded-b-2xl"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Uploads Table */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="mr-2">📋</span>
            {t('Recent Uploads')}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('File Name')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('Upload Date')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('Size')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{t('Status')}</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {stats.recentUploads.map((upload, index) => (
                    <motion.tr
                      key={upload.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{upload.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{upload.date}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{upload.size}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                          {upload.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {stats.recentUploads.length === 0 && (
            <motion.div
              className="text-center py-8 text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t('No uploads yet')}
            </motion.div>
          )}
        </motion.div>

        {/* 🚀 CYBERPUNK AI ASSISTANT CHAT */}
        <motion.div
          className="relative bg-cyber-surface/95 backdrop-blur-cyber rounded-2xl border border-cyber-primary/30 shadow-cyber-glow overflow-hidden"
          variants={itemVariants}
        >
          {/* 🚀 CYBERPUNK SCAN LINE EFFECT */}
          <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-2xl"></div>

          {/* 🚀 CYBERPUNK HOLOGRAPHIC OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/5 via-transparent to-cyber-accent/5 rounded-2xl"></div>

          {/* 🚀 CYBERPUNK ELECTRIC BORDER */}
          <div className="absolute inset-0 rounded-2xl border border-cyber-primary/50 animate-cyber-pulse"></div>
          <div className="absolute inset-1 rounded-xl border border-cyber-secondary/30 animate-cyber-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute inset-2 rounded-lg border border-cyber-accent/20 animate-cyber-pulse" style={{ animationDelay: '0.4s' }}></div>

          {/* 🚀 CYBERPUNK PARTICLE EFFECTS */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyber-primary rounded-full animate-cyber-particle-odd"></div>
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyber-accent rounded-full animate-cyber-particle-even"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyber-secondary rounded-full animate-cyber-particle-odd"></div>
          </div>

          <div className="relative z-10 p-6">
            <motion.h2
              className="text-2xl font-cyber-header font-bold text-cyber-primary mb-6 flex items-center"
              animate={{
                textShadow: [
                  '0 0 5px rgba(0, 255, 255, 0.5)',
                  '0 0 15px rgba(0, 255, 255, 0.8)',
                  '0 0 5px rgba(0, 255, 255, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="mr-3">🤖</span>
              AI Data Assistant
            </motion.h2>

            {/* Chat Messages Container */}
            <div
              ref={chatContainerRef}
              className="h-80 overflow-y-auto mb-4 space-y-4 p-2 bg-cyber-surface/50 rounded-lg border border-cyber-primary/20"
            >
              {chatMessages.length === 0 && !isAiTyping && (
                <div className="text-center text-cyber-text-secondary py-8">
                  <div className="text-4xl mb-2">💭</div>
                  <p>Ask me anything about your data!</p>
                  <p className="text-sm mt-2">Try: "What insights can you give me?" or "Summarize my data"</p>
                </div>
              )}

              <AnimatePresence>
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-cyber-primary text-white ml-12'
                          : message.error
                          ? 'bg-red-500/20 border border-red-500/50 text-red-300 mr-12'
                          : 'bg-cyber-surface border border-cyber-primary/30 text-cyber-text-primary mr-12'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* AI Typing Indicator */}
              {isAiTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-cyber-surface border border-cyber-primary/30 rounded-lg px-4 py-2 mr-12">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
                      <div className="w-2 h-2 bg-cyber-accent rounded-full animate-cyber-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-cyber-secondary rounded-full animate-cyber-pulse" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-cyber-text-secondary text-sm ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your data..."
                className="flex-1 px-4 py-2 bg-cyber-surface border border-cyber-primary/30 rounded-lg text-cyber-text-primary placeholder-cyber-text-secondary focus:outline-none focus:border-cyber-primary focus:shadow-cyber-glow transition-all"
                disabled={isAiTyping}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!userMessage.trim() || isAiTyping}
                className="px-6 py-2 bg-cyber-primary hover:bg-cyber-primary/80 disabled:bg-cyber-primary/50 text-white rounded-lg border border-cyber-primary/50 shadow-cyber-glow hover:shadow-cyber-glow transition-all disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">Send</span>
              </motion.button>
            </div>

            <motion.div
              className="mt-4 flex items-center text-sm text-cyber-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <span className="w-2 h-2 bg-cyber-primary rounded-full mr-2 animate-cyber-pulse"></span>
              Powered by Gemini AI • Context-aware data analysis
            </motion.div>
          </div>

          {/* 🚀 CYBERPUNK BOTTOM GLOW LINE */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyber-primary via-cyber-accent to-cyber-secondary rounded-b-2xl"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
