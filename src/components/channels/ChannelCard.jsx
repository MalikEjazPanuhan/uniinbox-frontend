import { motion } from 'framer-motion';
import { Mail, MessageCircle, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

const channelIcons = {
  gmail: Mail,
  slack: MessageCircle,
  whatsapp: MessageCircle,
  teams: MessageCircle,
};

const channelColors = {
  gmail: 'from-red-500 to-orange-500',
  slack: 'from-purple-500 to-pink-500',
  whatsapp: 'from-emerald-500 to-teal-500',
  teams: 'from-blue-500 to-indigo-500',
};

export default function ChannelCard({ channel, index, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(channel.is_active && channel.id !== null);
  
  const Icon = channelIcons[channel.channel_type] || LinkIcon;
  const gradient = channelColors[channel.channel_type] || 'from-gray-500 to-gray-600';

  const handleConnect = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/channels/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channel_type: channel.channel_type,
          channel_name: channel.channel_name || channel.channel_type.charAt(0).toUpperCase() + channel.channel_type.slice(1),
          config: {},
          sync_enabled: true,
          sync_frequency: 60
        })
      });

      if (response.status === 400) {
        const error = await response.json();
        if (error.detail?.includes('already exists')) {
          toast('Channel already connected!', {
            icon: 'ℹ️',
            duration: 3000,
          });
          setIsConnected(true);
          if (onUpdate) onUpdate();
          return;
        }
        throw new Error(error.detail || 'Failed to connect');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to connect');
      }

      toast.success(`✅ ${channel.channel_name || channel.channel_type} connected!`);
      setIsConnected(true);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(error.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!channel.id) {
      toast.error('Channel not found');
      return;
    }

    if (!confirm(`Are you sure you want to disconnect ${channel.channel_name || channel.channel_type}?`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/channels/${channel.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to disconnect');
      }

      toast.success(`✅ ${channel.channel_name || channel.channel_type} disconnected!`);
      setIsConnected(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error(error.message || 'Failed to disconnect');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (isConnected && channel.id) {
      handleDisconnect();
    } else {
      handleConnect();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-2xl p-6 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
            {channel.channel_name || channel.channel_type}
          </h3>
          <p className="text-xs text-gray-400">{channel.channel_type}</p>
          {isConnected && (
            <span className="text-xs text-emerald-500 font-medium">● Connected</span>
          )}
        </div>
        <button
          onClick={handleClick}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            isConnected && channel.id
              ? 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30'
              : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30'
          } disabled:opacity-50`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isConnected && channel.id ? (
            'Disconnect'
          ) : (
            'Connect'
          )}
        </button>
      </div>
    </motion.div>
  );
}
