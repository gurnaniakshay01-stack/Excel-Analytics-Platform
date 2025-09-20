import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const ExcelDataView = ({ data, onBack }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  if (!data || data.length === 0) {
    return (
      <motion.div
        className="relative p-6 rounded-xl bg-cyber-surface/90 backdrop-blur-cyber border border-cyber-primary/30 text-cyber-text"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Scan Line Effect */}
        <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-xl"></div>
        <p className="text-cyber-text-secondary font-cyber-body">{t('No data to display')}</p>
        <motion.button
          onClick={onBack}
          className="mt-4 px-6 py-3 rounded-lg font-cyber-body font-semibold bg-cyber-primary hover:bg-cyber-primary/80 text-cyber-text border border-cyber-primary/50 hover:border-cyber-accent/50 transition-all duration-300 hover:shadow-cyber-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('Back')}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative p-6 rounded-xl bg-cyber-surface/90 backdrop-blur-cyber border border-cyber-primary/30 text-cyber-text shadow-cyber-electric overflow-auto max-h-[80vh]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Scan Line Effect */}
      <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-xl"></div>

      <motion.button
        onClick={onBack}
        className="mb-6 px-6 py-3 rounded-lg font-cyber-body font-semibold bg-cyber-primary hover:bg-cyber-primary/80 text-cyber-text border border-cyber-primary/50 hover:border-cyber-accent/50 transition-all duration-300 hover:shadow-cyber-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('Back')}
      </motion.button>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-cyber-primary/30 rounded-lg overflow-hidden">
          <thead className="bg-cyber-surface/60 border-b border-cyber-primary/50">
            <tr>
              {data[0].map((header, index) => (
                <th
                  key={index}
                  className="border border-cyber-primary/20 px-6 py-4 text-left text-sm font-cyber-header font-semibold text-cyber-primary uppercase tracking-wider"
                >
                  {header || `Column ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-cyber-surface/40">
            {data.slice(1).map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                className={`${rowIndex % 2 === 0 ? 'bg-cyber-surface/20' : 'bg-cyber-surface/10'} hover:bg-cyber-primary/10 transition-colors duration-200`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-cyber-primary/10 px-6 py-4 text-sm text-cyber-text-secondary font-cyber-body"
                  >
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ExcelDataView;
