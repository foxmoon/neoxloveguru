import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';

const ExpandableContent = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const summaryLength = 100;

  const getSummary = (text) => {
    if (typeof text !== 'string') {
      return 'Content is not available as text';
    }
    const plainText = marked(text).replace(/<[^>]*>/g, '');
    if (plainText.length <= summaryLength) return plainText;
    return plainText.slice(0, summaryLength).trim() + '...';
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="mt-4 bg-white bg-opacity-50 rounded-lg overflow-hidden">
      <button
        className="w-full text-left p-4 font-bold text-gray-800 hover:bg-white hover:bg-opacity-75 transition-colors duration-200"
        onClick={toggleExpand}
      >
        {title}
        <span className="float-right">{isExpanded ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4">{content}</div>
          </motion.div>
        ) : (
          <div className="p-4 text-gray-600">
            {getSummary(typeof content === 'string' ? content : 'Click to expand for full content')}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableContent;