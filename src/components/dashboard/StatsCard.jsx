import { motion } from 'framer-motion';

export default function StatsCard({ label, value, icon: Icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
        transition: { type: "spring", stiffness: 300 }
      }}
      className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 p-6 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <motion.div 
          className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center"
          whileHover={{ rotate: 10 }}
        >
          <Icon className="w-6 h-6 text-indigo-500" />
        </motion.div>
        <motion.span 
          className="text-xs font-medium text-emerald-500"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          ↑ 12%
        </motion.span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}
