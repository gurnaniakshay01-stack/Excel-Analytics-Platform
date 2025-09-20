import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { setXAxis, setYAxis, setChartType } from '../redux/dataSlice';
import { useTheme } from '../contexts/ThemeContext';

// Chart type icons
const BarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LineIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4" />
  </svg>
);

const PieIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const ScatterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16a2 2 0 002 2h12a2 2 0 002-2V4" />
  </svg>
);

const ThreeDIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const DataMapping = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.excelData);
  const xAxis = useSelector((state) => state.data.xAxis);
  const yAxis = useSelector((state) => state.data.yAxis);
  const chartType = useSelector((state) => state.data.chartType);

  const [isDropdownOpen, setIsDropdownOpen] = useState({ x: false, y: false, chart: false });

  if (!data || data.length === 0) {
    return (
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
          📊
        </motion.div>
        <p className="text-lg font-medium">{t('Please upload an Excel file to map data')}</p>
      </motion.div>
    );
  }

  // Assume first row is header
  const headers = data[0];

  const handleXAxisChange = (value) => {
    dispatch(setXAxis(value));
    setIsDropdownOpen(prev => ({ ...prev, x: false }));
  };

  const handleYAxisChange = (value) => {
    dispatch(setYAxis(value));
    setIsDropdownOpen(prev => ({ ...prev, y: false }));
  };

  const handleChartTypeChange = (type) => {
    dispatch(setChartType(type));
    setIsDropdownOpen(prev => ({ ...prev, chart: false }));
  };

  const chartTypes = [
    { type: 'bar', icon: BarIcon, label: t('Bar Chart') },
    { type: 'line', icon: LineIcon, label: t('Line Chart') },
    { type: 'pie', icon: PieIcon, label: t('Pie Chart') },
    { type: 'scatter', icon: ScatterIcon, label: t('Scatter Plot') },
    { type: '3d', icon: ThreeDIcon, label: t('3D Chart') }
  ];

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

  const dropdownVariants = {
    closed: { opacity: 0, y: -10, scale: 0.95 },
    open: { opacity: 1, y: 0, scale: 1 }
  };

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
        <h2 className="text-3xl font-bold mb-2">{t('Data Mapping & Visualization')}</h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('Select axes and chart type to create your visualization')}
        </p>
      </motion.div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* X Axis Selector */}
        <motion.div
          className={`relative ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('X Axis')}
          </label>

          <motion.button
            onClick={() => setIsDropdownOpen(prev => ({ ...prev, x: !prev.x }))}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className={xAxis ? 'font-medium' : 'text-gray-500'}>
              {xAxis || t('Select X axis')}
            </span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isDropdownOpen.x ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen.x && (
              <motion.div
                className={`absolute top-full left-0 right-0 mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto`}
                variants={dropdownVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.2 }}
              >
                {headers.map((header, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleXAxisChange(header)}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${
                      xAxis === header ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : ''
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {header}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Y Axis Selector */}
        <motion.div
          className={`relative ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('Y Axis')}
          </label>

          <motion.button
            onClick={() => setIsDropdownOpen(prev => ({ ...prev, y: !prev.y }))}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className={yAxis ? 'font-medium' : 'text-gray-500'}>
              {yAxis || t('Select Y axis')}
            </span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isDropdownOpen.y ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen.y && (
              <motion.div
                className={`absolute top-full left-0 right-0 mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto`}
                variants={dropdownVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.2 }}
              >
                {headers.map((header, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleYAxisChange(header)}
                    className={`w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors ${
                      yAxis === header ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' : ''
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {header}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Chart Type Selector */}
        <motion.div
          className={`relative ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('Chart Type')}
          </label>

          <motion.button
            onClick={() => setIsDropdownOpen(prev => ({ ...prev, chart: !prev.chart }))}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-3">
              {chartType && (
                <div className="w-6 h-6">
                  {chartTypes.find(ct => ct.type === chartType)?.icon()}
                </div>
              )}
              <span className={chartType ? 'font-medium' : 'text-gray-500'}>
                {chartType ? chartTypes.find(ct => ct.type === chartType)?.label : t('Select chart type')}
              </span>
            </div>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isDropdownOpen.chart ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen.chart && (
              <motion.div
                className={`absolute top-full left-0 right-0 mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg shadow-xl z-10`}
                variants={dropdownVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.2 }}
              >
                {chartTypes.map((chart, idx) => (
                  <motion.button
                    key={chart.type}
                    onClick={() => handleChartTypeChange(chart.type)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors ${
                      chartType === chart.type ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' : ''
                    }`}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <chart.icon />
                    <span>{chart.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Data Preview */}
      {xAxis && yAxis && (
        <motion.div
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4">{t('Data Preview')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-500 border-gray-200'} border-b`}>
                    {xAxis}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-500 border-gray-200'} border-b`}>
                    {yAxis}
                  </th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                {data.slice(1, 6).map((row, idx) => (
                  <motion.tr
                    key={idx}
                    className={idx % 2 === 0 ? (isDarkMode ? 'bg-gray-750' : 'bg-gray-50') : ''}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-900 border-gray-200'} border-b`}>
                      {row[headers.indexOf(xAxis)]}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300 border-gray-600' : 'text-gray-900 border-gray-200'} border-b`}>
                      {row[headers.indexOf(yAxis)]}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DataMapping;
