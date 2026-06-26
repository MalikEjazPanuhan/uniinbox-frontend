import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, Link, Bot } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Total Messages', value: '1,247', icon: MessageSquare, trend: '+12%', trendUp: true },
  { label: 'Active Personas', value: '6', icon: Users, trend: '+2', trendUp: true },
  { label: 'Connected Channels', value: '4', icon: Link, trend: '+1', trendUp: true },
  { label: 'AI Actions', value: '89', icon: Bot, trend: '+23%', trendUp: true },
];

const activityData = [
  { day: 'Mon', messages: 45 },
  { day: 'Tue', messages: 78 },
  { day: 'Wed', messages: 62 },
  { day: 'Thu', messages: 95 },
  { day: 'Fri', messages: 83 },
  { day: 'Sat', messages: 40 },
  { day: 'Sun', messages: 28 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your communications.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
              transition: { type: "spring", stiffness: 300 }
            }}
            className="relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center"
                  whileHover={{ rotate: 10 }}
                >
                  <stat.icon className="w-6 h-6 text-indigo-500" />
                </motion.div>
                <motion.span 
                  className={`text-xs font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-red-500'}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {stat.trend}
                </motion.span>
              </div>
              <div className="mt-4">
                <motion.p 
                  className="text-2xl font-bold text-slate-700 dark:text-slate-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">📊 Message Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={activityData}>
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
              />
              <Line type="monotone" dataKey="messages" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <motion.button 
              onClick={() => navigate('/personas')}
              className="w-full px-4 py-3 bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-500/20 transition-colors text-sm font-medium text-left flex items-center gap-3"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">✨</span>
              Generate New Persona
              <span className="ml-auto text-xs text-gray-400">→</span>
            </motion.button>

            <motion.button 
              onClick={() => navigate('/channels')}
              className="w-full px-4 py-3 bg-purple-500/10 text-purple-500 rounded-xl hover:bg-purple-500/20 transition-colors text-sm font-medium text-left flex items-center gap-3"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">🔗</span>
              Connect Channel
              <span className="ml-auto text-xs text-gray-400">→</span>
            </motion.button>

            <motion.button 
              onClick={() => navigate('/ai')}
              className="w-full px-4 py-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-colors text-sm font-medium text-left flex items-center gap-3"
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">🤖</span>
              AI Suggestions
              <span className="ml-auto text-xs text-gray-400">→</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
