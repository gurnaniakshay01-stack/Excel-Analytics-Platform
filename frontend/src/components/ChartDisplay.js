import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement, PieController, ArcElement, Tooltip, Legend, ScatterController, BubbleController } from 'chart.js';
import ThreeDChart from './ThreeDChart';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  ScatterController,
  BubbleController
);

const ChartDisplay = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const chartRef = useRef(null);
  const chartInstance = React.useRef(null);

  const data = useSelector((state) => state.data.excelData);
  const xAxis = useSelector((state) => state.data.xAxis);
  const yAxis = useSelector((state) => state.data.yAxis);
  const chartType = useSelector((state) => state.data.chartType);

  const [isExporting, setIsExporting] = useState(false);

  const show3D = chartType === '3d';

  useEffect(() => {
    if (show3D) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
      return;
    }

    if (!data || data.length === 0 || !xAxis || !yAxis) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
      return;
    }

    // Find indices of selected axes in header row
    const headers = data[0];
    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);

    if (xIndex === -1 || yIndex === -1) return;

    // Prepare data for chart
    const labels = [];
    const values = [];

    // Standard chart data preparation
    for (let i = 1; i < data.length; i++) {
      labels.push(data[i][xIndex]);
      values.push(Number(data[i][yIndex]) || 0);
    }

    // Check if canvas context is available
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get chart colors based on theme
    const chartColors = isDarkMode ? {
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      gridColor: 'rgba(156, 163, 175, 0.3)',
      textColor: '#ffffff'
    } : {
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgba(59, 130, 246, 1)',
      gridColor: 'rgba(209, 213, 219, 0.5)',
      textColor: '#374151'
    };

    // Configure chart based on type
    let chartConfig = {
      type: chartType === '3d' ? 'bar' : chartType,
      data: {
        labels,
        datasets: [
          {
            label: yAxis,
            data: values,
            backgroundColor: chartColors.backgroundColor,
            borderColor: chartColors.borderColor,
            borderWidth: 1,
            fill: chartType === 'line' ? false : chartColors.backgroundColor,
            tension: chartType === 'line' ? 0.1 : 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: chartColors.textColor
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: chartColors.textColor,
            bodyColor: chartColors.textColor,
            borderColor: chartColors.borderColor,
            borderWidth: 1
          },
        },
        scales: chartType !== 'pie' ? {
          x: {
            title: {
              display: true,
              text: xAxis,
              color: chartColors.textColor
            },
            ticks: {
              color: chartColors.textColor,
              maxRotation: 45,
              minRotation: 0
            },
            grid: {
              color: chartColors.gridColor
            }
          },
          y: {
            title: {
              display: true,
              text: yAxis,
              color: chartColors.textColor
            },
            beginAtZero: false, // Allow natural scaling based on data
            ticks: {
              color: chartColors.textColor,
              callback: function(value) {
                // Format large numbers for better readability
                if (Math.abs(value) >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M';
                } else if (Math.abs(value) >= 1000) {
                  return (value / 1000).toFixed(1) + 'K';
                }
                return value;
              }
            },
            grid: {
              color: chartColors.gridColor
            }
          },
        } : {},
      },
    };

    try {
      chartInstance.current = new Chart(ctx, chartConfig);
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, xAxis, yAxis, chartType, isDarkMode]);

  const exportToPNG = async () => {
    setIsExporting(true);
    try {
      if (show3D) {
        const canvas = document.querySelector('div[style*="background-color"] > canvas');
        if (canvas) {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `chart-${Date.now()}.png`;
          link.click();
        }
      } else {
        const canvas = chartRef.current;
        if (canvas) {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `chart-${Date.now()}.png`;
          link.click();
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
    setIsExporting(false);
  };

  // PDF export temporarily disabled due to build issues
  const exportToPDF = async () => {
    alert('PDF export is temporarily disabled. Please use PNG export.');
  };

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
        <p className="text-lg font-medium">{t('Please upload data to display chart')}</p>
      </motion.div>
    );
  }

  if (!xAxis || !yAxis) {
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
          📈
        </motion.div>
        <p className="text-lg font-medium">{t('Please select X and Y axes to display chart')}</p>
      </motion.div>
    );
  }

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
        <h2 className="text-3xl font-bold mb-2">{t('Interactive Chart Display')}</h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('Visualize your data with interactive charts and export options')}
        </p>
      </motion.div>

      {/* Chart Type Info */}
      <motion.div
        className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              chartType === '3d'
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {chartType === '3d' ? t('3D Chart') : t('2D Chart')}
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('Type')}: {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </span>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={exportToPNG}
              disabled={isExporting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600'
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{isExporting ? t('Exporting...') : t('PNG')}</span>
            </motion.button>

            <motion.button
              onClick={exportToPDF}
              disabled={isExporting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600'
                  : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{isExporting ? t('Exporting...') : t('PDF (Disabled)')}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Chart Container */}
      <motion.div
        className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg overflow-hidden`}
        variants={itemVariants}
        style={{ height: '500px' }}
      >
        <div className="p-6 h-full">
          {show3D ? (
            <ThreeDChart data={data} xAxis={xAxis} yAxis={yAxis} />
          ) : (
            <canvas ref={chartRef} className="w-full h-full" />
          )}
        </div>
      </motion.div>

      {/* Chart Info */}
      <motion.div
        className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}
        variants={itemVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {data.length - 1}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('Data Points')}
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {xAxis}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('X Axis')}
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {yAxis}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('Y Axis')}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChartDisplay;
