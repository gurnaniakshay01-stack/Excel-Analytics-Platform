import React, { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { setExcelData } from '../redux/dataSlice';
import { useTheme } from '../contexts/ThemeContext';
import ExcelDataView from './ExcelDataView';

const ExcelUpload = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.excelData);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingFiles, setProcessingFiles] = useState(new Set());
  const fileInputRef = useRef(null);

  const processFile = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }
      };

      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

          // Store file info
          const fileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            data: jsonData,
            uploadedAt: new Date().toISOString()
          };

          resolve(fileInfo);
        } catch (error) {
          reject(new Error(`Failed to process ${file.name}: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsBinaryString(file);
    });
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      try {
        const fileInfo = await processFile(file);

        // Add to uploaded files
        setUploadedFiles(prev => [...prev, fileInfo]);

        // Dispatch to Redux store
        dispatch(setExcelData(fileInfo.data));

        // Clear progress
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });

      } catch (error) {
        console.error('Upload error:', error);
        // Handle error (could show toast notification)
      }
    }

    setIsUploading(false);
  }, [processFile, dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: isUploading
  });

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileName) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    dispatch(setExcelData([])); // Clear the data preview
    setUploadError(''); // Clear any error message
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const dropzoneVariants = {
    idle: {
      scale: 1,
      borderColor: isDarkMode ? '#4B5563' : '#D1D5DB'
    },
    active: {
      scale: 1.02,
      borderColor: '#3B82F6',
      backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 🚀 CYBERPUNK HEADER */}
      <motion.div
        className="text-center relative"
        variants={itemVariants}
      >
        <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none"></div>
        <h1 className="text-4xl font-cyber-header font-bold mb-3 text-cyber-primary animate-cyber-pulse">
          {t('Upload Excel Files')}
        </h1>
        <p className="text-lg text-cyber-text-secondary font-cyber-body">
          {t('Drag and drop your Excel files here or click to select files')}
        </p>
        <div className="mt-2 h-px bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent"></div>
      </motion.div>

      {/* 🚀 CYBERPUNK ERROR MESSAGE */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            className="relative p-4 rounded-xl border border-cyber-error/50 bg-cyber-error/10 backdrop-blur-cyber text-cyber-error shadow-cyber-glow"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scan Line Effect */}
            <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-xl"></div>
            <div className="flex items-center relative z-10">
              <motion.svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
              <span className="font-cyber-body font-semibold">{uploadError}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 CYBERPUNK UPLOAD ZONE */}
      <motion.div
        variants={dropzoneVariants}
        animate={isDragActive ? "active" : "idle"}
        transition={{ duration: 0.2 }}
      >
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 bg-cyber-surface/90 backdrop-blur-cyber border-cyber-primary/30 hover:border-cyber-accent/50 overflow-hidden ${
            isDragActive
              ? 'border-cyber-primary bg-cyber-primary/10 shadow-cyber-glow animate-cyber-pulse'
              : 'hover:bg-cyber-surface/60'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          {/* 🚀 CYBERPUNK SCAN LINE EFFECT */}
          <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-2xl"></div>

          {/* 🚀 CYBERPUNK PARTICLE EFFECTS */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="particle absolute top-1/4 left-1/4 w-1 h-1 bg-cyber-primary rounded-full animate-cyber-particle-odd"></div>
            <div className="particle absolute top-3/4 right-1/4 w-1 h-1 bg-cyber-accent rounded-full animate-cyber-particle-even"></div>
            <div className="particle absolute top-1/2 left-1/2 w-1 h-1 bg-cyber-secondary rounded-full animate-cyber-particle-odd"></div>
            <div className="particle absolute top-1/6 right-1/3 w-1 h-1 bg-cyber-primary rounded-full animate-cyber-particle-even"></div>
            <div className="particle absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyber-accent rounded-full animate-cyber-particle-odd"></div>
          </div>

          {/* 🚀 CYBERPUNK DRAG OVERLAY */}
          <AnimatePresence>
            {isDragActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyber-primary/20 via-cyber-secondary/10 to-cyber-accent/20 rounded-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Electric border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-cyber-primary animate-cyber-pulse"></div>
                <div className="absolute inset-2 rounded-xl border border-cyber-secondary animate-cyber-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute inset-4 rounded-lg border border-cyber-accent animate-cyber-pulse" style={{ animationDelay: '0.4s' }}></div>
              </motion.div>
            )}
          </AnimatePresence>
<input {...getInputProps()} ref={fileInputRef} />

<motion.div
  className="flex flex-col items-center space-y-4"
  animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
  transition={{ duration: 0.2 }}
>
  {/* 🚀 CYBERPUNK UPLOAD ICON */}
<motion.div
  className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${
    isDragActive
      ? 'bg-cyber-primary/20 border-cyber-primary text-cyber-primary shadow-cyber-glow'
      : 'bg-cyber-surface border-cyber-primary/30 text-cyber-text-secondary hover:border-cyber-accent/50'
  } backdrop-blur-cyber transition-all duration-300`}
  animate={isDragActive ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { scale: 1 }}
  transition={{ duration: 0.5 }}
  whileHover={{ scale: 1.05 }}
>
    <motion.svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      animate={isDragActive ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </motion.svg>
  </motion.div>

            {/* 🚀 CYBERPUNK UPLOAD TEXT */}
            <div className="text-center">
              <motion.p
                className={`text-xl font-cyber-header font-bold mb-2 ${
                  isDragActive ? 'text-cyber-primary animate-cyber-pulse' : 'text-cyber-text'
                }`}
                animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isDragActive ? t('Drop your files here') : t('Drag & drop files here')}
              </motion.p>
              <p className="text-cyber-text-secondary font-cyber-body">
                {t('or click to select files')}
              </p>
              <p className="text-sm mt-2 text-cyber-text-secondary/70 font-cyber-body">
                {t('Supported formats')}: .xlsx, .xls
              </p>
            </div>

            {/* 🚀 CYBERPUNK UPLOAD BUTTON */}
            <motion.button
              onClick={handleFileSelect}
              className="px-8 py-3 rounded-lg font-cyber-body font-bold bg-cyber-primary hover:bg-cyber-primary/80 text-cyber-text border border-cyber-primary/50 hover:border-cyber-accent transition-all duration-300 hover:shadow-cyber-glow disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isUploading}
            >
              {t('Choose Files')}
            </motion.button>
          </motion.div>

          {/* 🚀 CYBERPUNK LOADING OVERLAY */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                className="absolute inset-0 bg-cyber-surface/95 backdrop-blur-cyber rounded-2xl flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* 🚀 CYBERPUNK SCAN LINE EFFECT */}
                <div className="absolute inset-0 animate-cyber-scan opacity-10 pointer-events-none rounded-2xl"></div>

                <div className="text-center relative z-10">
                  {/* 🚀 CYBERPUNK CIRCULAR PROGRESS */}
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Outer ring */}
                    <motion.div
                      className="absolute inset-0 border-4 border-cyber-primary/30 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner ring */}
                    <motion.div
                      className="absolute inset-2 border-4 border-cyber-secondary/30 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Electric arcs */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="absolute top-0 left-1/2 w-1 h-3 bg-cyber-accent rounded-full transform -translate-x-1/2 shadow-cyber-glow"></div>
                      <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-cyber-primary rounded-full transform -translate-x-1/2 shadow-cyber-glow"></div>
                      <div className="absolute left-0 top-1/2 w-3 h-1 bg-cyber-secondary rounded-full transform -translate-y-1/2 shadow-cyber-glow"></div>
                      <div className="absolute right-0 top-1/2 w-3 h-1 bg-cyber-accent rounded-full transform -translate-y-1/2 shadow-cyber-glow"></div>
                    </motion.div>

                    {/* Center dot */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.div
                        className="w-3 h-3 bg-cyber-primary rounded-full shadow-cyber-glow"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.div>
                  </div>

                  {/* 🚀 CYBERPUNK LOADING TEXT */}
                  <motion.p
                    className="text-cyber-primary font-cyber-header font-bold text-lg animate-cyber-pulse"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {t('Processing files...')}
                  </motion.p>

                  {/* 🚀 CYBERPUNK SUBTEXT */}
                  <p className="text-cyber-text-secondary font-cyber-body text-sm mt-2">
                    {t('Analyzing data structure')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <h2 className="text-2xl font-cyber-header font-bold mb-6 text-cyber-primary animate-cyber-pulse">
              {t('Uploaded Files')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={file.name}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5,
                      z: 50
                    }}
                    style={{ perspective: '1000px' }}
                  >
                    {/* 🚀 CYBERPUNK 3D CARD */}
                    <div className="relative bg-cyber-surface/95 backdrop-blur-cyber border border-cyber-primary/30 rounded-2xl p-6 shadow-cyber-glow hover:shadow-cyber-glow-intense transition-all duration-500 overflow-hidden">
                      {/* 🚀 CYBERPUNK SCAN LINE EFFECT */}
                      <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-2xl"></div>

                      {/* 🚀 CYBERPUNK HOLOGRAPHIC OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/5 via-transparent to-cyber-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* 🚀 CYBERPUNK FILE ICON */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="relative w-12 h-12 bg-gradient-to-br from-cyber-primary/20 to-cyber-accent/20 rounded-xl flex items-center justify-center border border-cyber-primary/30 shadow-cyber-glow"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Electric border effect */}
                            <div className="absolute inset-0 rounded-xl border border-cyber-secondary/50 animate-cyber-pulse"></div>
                            <motion.svg
                              className="w-6 h-6 text-cyber-primary relative z-10"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </motion.svg>
                          </motion.div>
                          <div>
                            <h3 className="font-cyber-header font-bold text-sm text-cyber-text truncate max-w-32">
                              {file.name}
                            </h3>
                            <p className="text-xs text-cyber-text-secondary/70 font-cyber-body">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>

                        {/* 🚀 CYBERPUNK REMOVE BUTTON */}
                        <motion.button
                          onClick={() => removeFile(file.name)}
                          className="p-2 rounded-lg bg-cyber-error/10 hover:bg-cyber-error/20 border border-cyber-error/30 text-cyber-error transition-all duration-300 hover:shadow-cyber-glow"
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </div>

                      {/* 🚀 CYBERPUNK FILE STATS */}
                      <div className="space-y-3">
                        <motion.div
                          className="flex justify-between items-center text-sm p-2 rounded-lg bg-cyber-surface/50 border border-cyber-primary/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-cyber-text-secondary font-cyber-body">
                            {t('Rows')}:
                          </span>
                          <span className="font-cyber-header font-bold text-cyber-primary">
                            {file.data.length}
                          </span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center text-sm p-2 rounded-lg bg-cyber-surface/50 border border-cyber-secondary/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-cyber-text-secondary font-cyber-body">
                            {t('Columns')}:
                          </span>
                          <span className="font-cyber-header font-bold text-cyber-secondary">
                            {file.data[0]?.length || 0}
                          </span>
                        </motion.div>
                        <motion.div
                          className="flex justify-between items-center text-sm p-2 rounded-lg bg-cyber-surface/50 border border-cyber-accent/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-cyber-text-secondary font-cyber-body">
                            {t('Uploaded')}:
                          </span>
                          <span className="font-cyber-header font-bold text-cyber-accent text-xs">
                            {new Date(file.uploadedAt).toLocaleTimeString()}
                          </span>
                        </motion.div>
                      </div>

                      {/* 🚀 CYBERPUNK PROGRESS BAR */}
                      {uploadProgress[file.name] && uploadProgress[file.name] < 100 && (
                        <motion.div
                          className="mt-4 p-3 rounded-lg bg-cyber-surface/30 border border-cyber-primary/20"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-cyber-text-secondary font-cyber-body">
                              {t('Upload Progress')}
                            </span>
                            <span className="font-cyber-header font-bold text-cyber-primary">
                              {uploadProgress[file.name]}%
                            </span>
                          </div>
                          <div className="relative w-full bg-cyber-surface/50 rounded-full h-3 border border-cyber-primary/30">
                            <motion.div
                              className="h-3 bg-gradient-to-r from-cyber-primary to-cyber-accent rounded-full shadow-cyber-glow"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress[file.name]}%` }}
                              transition={{ duration: 0.5 }}
                            />
                            {/* Electric effect on progress bar */}
                            <motion.div
                              className="absolute top-0 h-3 bg-cyber-secondary/50 rounded-full"
                              animate={{ width: ['0%', '20%', '0%'] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* 🚀 CYBERPUNK HOVER PARTICLES */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyber-primary rounded-full animate-cyber-particle-odd"></div>
                        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyber-accent rounded-full animate-cyber-particle-even"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyber-secondary rounded-full animate-cyber-particle-odd"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 CYBERPUNK DATA PREVIEW */}
      <AnimatePresence>
        {data.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-cyber-header font-bold text-cyber-primary animate-cyber-pulse">
                {t('Data Preview')}
              </h2>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-cyber-body font-medium text-cyber-text-secondary">
                  {t('Rows per page')}:
                </label>
                <motion.select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}
                  className="px-3 py-2 rounded-lg text-sm bg-cyber-surface border border-cyber-primary/30 text-cyber-text focus:outline-none focus:ring-2 focus:ring-cyber-primary/50 focus:border-cyber-accent transition-all duration-300 hover:border-cyber-accent/50"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value="All">{t('All')}</option>
                </motion.select>
              </div>
            </div>

            <motion.div
              className={`overflow-x-auto rounded-2xl border border-cyber-primary/30 max-w-full mx-auto bg-cyber-surface/95 backdrop-blur-cyber shadow-cyber-glow ${rowsPerPage !== 5 && rowsPerPage !== 'All' && data.length > 6 ? 'max-h-96 overflow-y-auto' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* 🚀 CYBERPUNK SCAN LINE EFFECT */}
              <div className="absolute inset-0 animate-cyber-scan opacity-5 pointer-events-none rounded-2xl"></div>

              <table className="min-w-full table-fixed relative">
                <thead className="bg-gradient-to-r from-cyber-primary/10 via-cyber-secondary/10 to-cyber-accent/10 border-b border-cyber-primary/30">
                  <tr>
                    {data[0]?.map((header, index) => (
                      <motion.th
                        key={index}
                        className="px-6 py-4 text-left text-xs font-cyber-header font-bold uppercase tracking-wider text-cyber-primary border-r border-cyber-primary/20 last:border-r-0"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, color: '#00ffff' }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-cyber-accent rounded-full animate-cyber-pulse"></div>
                          <span>{header || `Column ${index + 1}`}</span>
                        </div>
                      </motion.th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-cyber-surface/50">
                  {data.slice(1, rowsPerPage === 'All' ? data.length : rowsPerPage + 1).map((row, rowIndex) => (
                    <motion.tr
                      key={rowIndex}
                      className={`border-b border-cyber-primary/10 hover:bg-cyber-primary/5 transition-all duration-300 ${
                        rowIndex % 2 === 0 ? 'bg-cyber-surface/30' : 'bg-cyber-surface/20'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rowIndex * 0.05 }}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: 'rgba(0, 255, 255, 0.05)',
                        boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
                      }}
                    >
                      {row.map((cell, cellIndex) => (
                        <motion.td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm font-cyber-body text-cyber-text border-r border-cyber-primary/10 last:border-r-0"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-cyber-secondary rounded-full opacity-50"></div>
                            <span className="truncate max-w-32">{cell}</span>
                          </div>
                        </motion.td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {rowsPerPage !== 'All' && data.length > rowsPerPage + 1 && (
                <motion.div
                  className="px-6 py-4 bg-gradient-to-r from-cyber-primary/5 via-cyber-secondary/5 to-cyber-accent/5 border-t border-cyber-primary/20 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-sm font-cyber-body text-cyber-text-secondary">
                    {t('Showing')} {Math.min(rowsPerPage, data.length - 1)} {t('rows of')} {data.length - 1} {t('total rows')}
                  </span>
                  <div className="mt-2 h-px bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent"></div>
                </motion.div>
              )}

              {/* 🚀 CYBERPUNK TABLE PARTICLES */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyber-primary rounded-full animate-cyber-particle-odd"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyber-accent rounded-full animate-cyber-particle-even"></div>
                <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyber-secondary rounded-full animate-cyber-particle-odd"></div>
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyber-primary rounded-full animate-cyber-particle-even"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExcelUpload;
