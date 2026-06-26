import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Edit2, Send, Loader2, Sparkles, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MITLReview({ 
  suggestion, 
  onApprove, 
  onReject, 
  isProcessing 
}) {
  const [editedText, setEditedText] = useState(suggestion?.content || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!suggestion) return null;

  const handleApprove = () => {
    onApprove(editedText);
  };

  const handleReject = () => {
    onReject();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[80%] bg-indigo-50/80 dark:bg-indigo-950/30 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </motion.div>
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            AI Suggestion • Review & Confirm
          </span>
          {suggestion.persona && (
            <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
              <User className="w-3 h-3" />
              {suggestion.persona}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">
          Confidence: {(suggestion.confidence * 100).toFixed(0)}%
        </span>
      </div>

      {/* Suggestion Content */}
      <motion.div 
        className="bg-white dark:bg-slate-900 rounded-xl p-4 mb-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
        whileHover={{ scale: 1.01 }}
      >
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full min-h-[120px] p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 dark:text-slate-200"
            placeholder="Edit the AI suggestion..."
          />
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {suggestion.content}
          </p>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? 'Cancel Edit' : 'Edit'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReject}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Reject
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApprove}
          disabled={isProcessing}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {isProcessing ? 'Sending...' : 'Approve & Send'}
        </motion.button>
      </div>
    </motion.div>
  );
}
