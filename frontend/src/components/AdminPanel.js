import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

// Custom hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

// Mock data removed, using API data instead

const AdminPanel = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('users');
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Data states
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [files, setFiles] = useState([]);
  const [filesPagination, setFilesPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [usersRes, activityRes, analyticsRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin', { headers }),
          fetch('http://localhost:5000/api/admin/activity', { headers }),
          fetch('http://localhost:5000/api/admin/analytics', { headers })
        ]);

        if (!usersRes.ok || !activityRes.ok || !analyticsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const usersData = await usersRes.json();
        const activityData = await activityRes.json();
        const analyticsData = await analyticsRes.json();

        setUsers(usersData);
        setActivityLogs(activityData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.isActive === (filterStatus === 'active');
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      case 'moderator':
        return isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'user':
        return isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      default:
        return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'inactive':
        return isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800';
      default:
        return isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'uploaded_file':
        return '📤';
      case 'viewed_chart':
        return '👁️';
      case 'login':
        return '🔐';
      case 'exported_chart':
        return '📊';
      case 'deleted_file':
        return '🗑️';
      default:
        return '📝';
    }
  };

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

  const userCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    expanded: {
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  const timelineItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5
      }
    })
  };

  const tabs = [
    { id: 'users', label: t('Users'), icon: '👥' },
    { id: 'activity', label: t('Activity Logs'), icon: '📋' },
    { id: 'files', label: t('Files'), icon: '📁' },
    { id: 'analytics', label: t('Analytics'), icon: '📈' }
  ];

  return (
    <motion.div
      className="space-y-8 text-cyber-text"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="text-center"
        variants={itemVariants}
      >
        <h2 className="text-4xl font-cyber-header font-bold mb-3 text-cyber-primary animate-cyber-pulse">{t('Admin Panel')}</h2>
        <p className="text-lg text-cyber-text-secondary font-cyber-body">
          {t('Manage users, monitor activity, and view analytics')}
        </p>
      </motion.div>

      {/* Tab Navigation */}
      {isMobile ? (
        <motion.div
          className={`fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 px-4 ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} shadow-lg`}
          variants={itemVariants}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? isDarkMode
                    ? 'text-white bg-gray-700'
                    : 'text-gray-900 bg-gray-100'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className={`flex space-x-1 p-1 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
          variants={itemVariants}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? isDarkMode
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'bg-white text-gray-900 shadow-lg'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Users Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Filters */}
            <motion.div
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('Search Users')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('Search by name or email...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('Role')}
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                  >
                    <option value="all">{t('All Roles')}</option>
                    <option value="admin">{t('Admin')}</option>
                    <option value="moderator">{t('Moderator')}</option>
                    <option value="user">{t('User')}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('Status')}
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    }`}
                  >
                    <option value="all">{t('All Status')}</option>
                    <option value="active">{t('Active')}</option>
                    <option value="inactive">{t('Inactive')}</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* User Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg cursor-pointer`}
                    variants={userCardVariants}
                    initial="hidden"
                    animate={expandedUser === user.id ? "expanded" : "visible"}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.username}</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {t(user.role.charAt(0).toUpperCase() + user.role.slice(1))}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {t(user.status.charAt(0).toUpperCase() + user.status.slice(1))}
                        </span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedUser === user.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t pt-4 mt-4"
                        >
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('Last Login')}:
                              </span>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {user.lastLogin}
                              </p>
                            </div>
                            <div>
                              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('Uploads')}:
                              </span>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {user.uploads}
                              </p>
                            </div>
                            <div>
                              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('Join Date')}:
                              </span>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {user.joinDate}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <motion.button
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  isDarkMode
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {t('Edit')}
                              </motion.button>
                              <motion.button
                                className={`px-3 py-1 rounded text-xs transition-colors ${
                                  isDarkMode
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {t('Suspend')}
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Activity Logs Tab */}
        {activeTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-6">{t('Recent Activity')}</h3>
              <div className="space-y-4">
                {activityLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    className="flex items-start space-x-4"
                    variants={timelineItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        {getActionIcon(log.action)}
                      </div>
                      {index < activityLogs.length - 1 && (
                        <div className={`w-0.5 h-16 mt-2 ${
                          isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{log.user}</span>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {log.details}
                        </p>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          IP: {log.ip}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <motion.div
            key="files"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Files Header */}
            <motion.div
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
              variants={itemVariants}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{t('File Management')}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('Manage all uploaded files and data')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {filesPagination.totalItems || 0} {t('Files')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Files List */}
            <div className="space-y-4">
              {files.map((file, index) => (
                <motion.div
                  key={file._id}
                  className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          📄
                        </div>
                        <div>
                          <h4 className="font-semibold">{file.filename || file.originalName}</h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t('Uploaded by')}: {file.user?.username || 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('Size')}:
                          </span>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {file.fileSize ? `${(file.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('Type')}:
                          </span>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {file.fileType || 'Unknown'}
                          </p>
                        </div>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('Upload Date')}:
                          </span>
                          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('Status')}:
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            file.isPublic
                              ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                              : (isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800')
                          }`}>
                            {file.isPublic ? t('Public') : t('Private')}
                          </span>
                        </div>
                      </div>

                      {file.description && (
                        <div className="mt-3">
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('Description')}:
                          </span>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {file.description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <motion.button
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          isDarkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('View Data')}
                      </motion.button>
                      <motion.button
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          isDarkMode
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('Edit')}
                      </motion.button>
                      <motion.button
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          isDarkMode
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t('Delete')}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {files.length === 0 && !loading && (
                <motion.div
                  className={`p-12 text-center rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
                  variants={itemVariants}
                >
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-xl font-semibold mb-2">{t('No Files Found')}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('No files have been uploaded yet.')}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Pagination */}
            {filesPagination.totalPages > 1 && (
              <motion.div
                className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('Showing')} {((filesPagination.currentPage - 1) * filesPagination.itemsPerPage) + 1} {t('to')}{' '}
                    {Math.min(filesPagination.currentPage * filesPagination.itemsPerPage, filesPagination.totalItems)} {t('of')}{' '}
                    {filesPagination.totalItems} {t('files')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={filesPagination.currentPage === 1}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        filesPagination.currentPage === 1
                          ? (isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')
                          : (isDarkMode
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white')
                      }`}
                      onClick={() => {/* Handle previous page */}}
                    >
                      {t('Previous')}
                    </button>
                    <span className={`px-3 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {filesPagination.currentPage} / {filesPagination.totalPages}
                    </span>
                    <button
                      disabled={filesPagination.currentPage === filesPagination.totalPages}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        filesPagination.currentPage === filesPagination.totalPages
                          ? (isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')
                          : (isDarkMode
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white')
                      }`}
                      onClick={() => {/* Handle next page */}}
                    >
                      {t('Next')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: t('Total Users'), value: analytics.totalUsers || 0, color: 'blue', change: '+12%' },
                { label: t('Active Users'), value: analytics.activeUsers || 0, color: 'green', change: '+8%' },
                { label: t('Total Uploads'), value: analytics.totalUploads || 0, color: 'purple', change: '+24%' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`text-3xl font-bold mb-2 text-${stat.color}-500`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                    {stat.label}
                  </div>
                  <div className={`text-xs font-medium text-green-500`}>
                    {stat.change} {t('from last month')}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold mb-4">{t('System Overview')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">{t('User Distribution')}</h4>
                  <div className="space-y-2">
                    {[
                      { role: 'Admin', count: analytics.userDistribution?.admin || 0, color: 'bg-red-500' },
                      { role: 'Moderator', count: analytics.userDistribution?.moderator || 0, color: 'bg-blue-500' },
                      { role: 'User', count: analytics.userDistribution?.user || 0, color: 'bg-green-500' }
                    ].map((item) => (
                      <div key={item.role} className="flex items-center justify-between">
                        <span className="text-sm">{item.role}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">{t('Recent Activity Summary')}</h4>
                  <div className="space-y-2">
                    {[
                      { action: 'File Uploads', count: analytics.activitySummary?.uploaded_file || 0 },
                      { action: 'Chart Views', count: analytics.activitySummary?.viewed_chart || 0 },
                      { action: 'Exports', count: analytics.activitySummary?.exported_chart || 0 }
                    ].map((item) => (
                      <div key={item.action} className="flex items-center justify-between">
                        <span className="text-sm">{item.action}</span>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPanel;
