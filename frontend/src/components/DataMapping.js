import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { setXAxis, setYAxis } from '../redux/dataSlice';

const DataMapping = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();

  const excelData = useSelector((state) => state.data.excelData);
  const xAxis = useSelector((state) => state.data.xAxis);
  const yAxis = useSelector((state) => state.data.yAxis);

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (excelData && excelData.length > 0) {
      setColumns(excelData[0]);
    } else {
      setColumns([]);
    }
  }, [excelData]);

  const handleXAxisChange = (e) => {
    dispatch(setXAxis(e.target.value));
  };

  const handleYAxisChange = (e) => {
    dispatch(setYAxis(e.target.value));
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

  return (
    <motion.div
      className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg mb-6`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        variants={itemVariants}
      >
        {t('Data Mapping')}
      </motion.h2>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" variants={itemVariants}>
        <div>
          <label htmlFor="xAxis" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('Select X Axis')}
          </label>
          <select
            id="xAxis"
            value={xAxis || ''}
            onChange={handleXAxisChange}
            className={`w-full p-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyber-primary`}
          >
            <option value="" disabled>{t('Select column')}</option>
            {columns.map((col, idx) => (
              <option key={idx} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="yAxis" className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('Select Y Axis')}
          </label>
          <select
            id="yAxis"
            value={yAxis || ''}
            onChange={handleYAxisChange}
            className={`w-full p-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-cyber-primary`}
          >
            <option value="" disabled>{t('Select column')}</option>
            {columns.map((col, idx) => (
              <option key={idx} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Data Preview Table - MOBILE RESPONSIVE */}
      <motion.div
        className={`mt-6 overflow-x-auto rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
        variants={itemVariants}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y divide-gray-200 dark:divide-gray-700`}>
            {excelData.slice(1, 6).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-cyber-surface/50 transition-colors cursor-pointer">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-3 py-2 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default DataMapping;
