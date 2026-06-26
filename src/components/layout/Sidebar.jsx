import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Link, 
  Bot, 
  Settings,
  Sparkles
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/personas', icon: Users, label: 'Personas' },
  { path: '/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/channels', icon: Link, label: 'Channels' },
  { path: '/ai', icon: Bot, label: 'AI Assistant' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const linkVariants = {
  initial: { x: 0 },
  hover: { 
    x: 8,
    transition: { type: "spring", stiffness: 400 }
  }
};

const iconVariants = {
  initial: { rotate: 0, scale: 1 },
  hover: { 
    rotate: [0, -10, 10, -5, 5, 0],
    scale: 1.1,
    transition: { duration: 0.5 }
  }
};

export default function Sidebar() {
  return (
    <motion.aside 
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="fixed left-0 top-0 h-screen w-[280px] bg-slate-900 text-white flex flex-col shadow-2xl z-50"
    >
      <motion.div 
        className="p-6 border-b border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30"
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">UniInbox</h1>
            <p className="text-xs text-gray-400">AI Communication Agent</p>
          </div>
        </div>
      </motion.div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.1 }}
            variants={linkVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 
                 hover:bg-white/5 hover:text-white transition-all duration-200 
                 group cursor-pointer ${isActive ? 'bg-indigo-600/20 text-indigo-400 shadow-lg shadow-indigo-600/10' : ''}`
              }
            >
              <motion.div variants={iconVariants}>
                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              </motion.div>
              <span className="text-sm font-medium">{item.label}</span>
              {item.path === '/' && (
                <motion.span 
                  className="ml-auto text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  New
                </motion.span>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <motion.div 
        className="p-4 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="px-4 py-2 rounded-xl bg-white/5"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-xs text-gray-500">v1.0.0</p>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}