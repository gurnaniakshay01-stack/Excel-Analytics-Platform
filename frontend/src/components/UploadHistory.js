import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const UploadHistory = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedRow, setSelectedRow] = useState(null);
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const excelData = useSelector((state) => state.data.excelData);

  // Transform excelData into history items
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (excelData && excelData.length > 0) {
      const newEntry = {
        id: Date.now(),
        filename: 'Uploaded Excel File',
        uploadedAt: new Date().toLocaleString(),
        size: 'N/A',
        status: 'processed',
        rows: excelData.length,
        columns: excelData[0]?.length || 0,
      };
      setHistory((prev) => [newEntry, ...prev]);
    }
  }, [excelData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'processing':
        return isDarkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default:
        return isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const sortedHistory = [...history].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'uploadedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
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

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3
      }
    }),
    hover: {
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  const SortIcon = ({ column }) => (
    <motion.svg
      className="w-4 h-4 ml-1 inline"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      animate={{
        rotate: sortBy === column && sortOrder === 'asc' ? 180 : 0
      }}
      transition={{ duration: 0.2 }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </motion.svg>
  );

  return (
    <motion.div
      className={`space-y-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="text-center"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold mb-2">{t('Upload History')}</h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('Track and manage your uploaded files')}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t('Total Files'), value: mockHistory.length, color: 'blue' },
          { label: t('Processed'), value: mockHistory.filter(f => f.status === 'processed').length, color: 'green' },
          { label: t('Processing'), value: mockHistory.filter(f => f.status === 'processing').length, color: 'yellow' },
          { label: t('Failed'), value: mockHistory.filter(f => f.status === 'failed').length, color: 'red' }
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
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* History Table */}
      <motion.div
        className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg overflow-hidden`}
        variants={itemVariants}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th
                  className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => handleSort('filename')}
                >
                  {t('Filename')}
                  <SortIcon column="filename" />
                </th>
                <th
                  className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider cursor-pointer transition-colors ${
                    isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => handleSort('uploadedAt')}
                >
                  {t('Uploaded At')}
                  <SortIcon column="uploadedAt" />
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {t('Size')}
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {t('Status')}
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {t('Details')}
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {t('Actions')}
                </th>
              </tr>
            </thead>
            <tbody className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
              <AnimatePresence>
                {sortedHistory.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? (isDarkMode ? 'bg-gray-750' : 'bg-gray-50') : ''
                    } hover:bg-opacity-50 transition-colors cursor-pointer`}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    onClick={() => setSelectedRow(selectedRow === item.id ? null : item.id)}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-900 border-gray-200'
                    } border-b`}>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          📄
                        </div>
                        {item.filename}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-500 border-gray-200'
                    } border-b`}>
                      {item.uploadedAt}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-500 border-gray-200'
                    } border-b`}>
                      {item.size}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap border-gray-200 border-b`}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        <span className="mr-1">{getStatusIcon(item.status)}</span>
                        {t(item.status.charAt(0).toUpperCase() + item.status.slice(1))}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-500 border-gray-200'
                    } border-b`}>
                      {item.rows > 0 ? `${item.rows} rows, ${item.columns} cols` : t('N/A')}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium border-gray-200 border-b`}>
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
                          {t('View')}
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
                          {t('Delete')}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Empty State */}
      {mockHistory.length === 0 && (
        <motion.div
          className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📂
          </motion.div>
          <p className="text-lg font-medium">{t('No upload history yet')}</p>
          <p className="text-sm mt-2">{t('Upload your first Excel file to get started')}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadHistory;
