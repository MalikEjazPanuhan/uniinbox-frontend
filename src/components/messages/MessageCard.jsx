import { motion } from 'framer-motion';
import { Mail, Clock, Star, Flag, CheckCircle, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

// Channel icons and names mapping
const channelInfo = {
  gmail: { icon: '📧', name: 'Gmail' },
  slack: { icon: '💬', name: 'Slack' },
  whatsapp: { icon: '📱', name: 'WhatsApp' },
  teams: { icon: '💼', name: 'Teams' },
  outlook: { icon: '📨', name: 'Outlook' },
  default: { icon: '📨', name: 'Channel' },
};

export default function MessageCard({ message, index, onUpdate }) {
  const [channelName, setChannelName] = useState('Loading...');
  const [channelIcon, setChannelIcon] = useState('📨');

  // Get channel info when message loads
  useEffect(() => {
    const getChannelInfo = async () => {
      try {
        // If channel info is already in the message
        if (message.channel?.channel_type) {
          const info = channelInfo[message.channel.channel_type] || channelInfo.default;
          setChannelIcon(info.icon);
          setChannelName(message.channel.channel_name || info.name);
          return;
        }

        // If channel_id is available, fetch channel details
        if (message.channel_id) {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/api/v1/channels/${message.channel_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const channel = await response.json();
            const info = channelInfo[channel.channel_type] || channelInfo.default;
            setChannelIcon(info.icon);
            setChannelName(channel.channel_name || info.name);
          }
        }
      } catch (error) {
        console.error('Error fetching channel info:', error);
        setChannelIcon('📨');
        setChannelName('Unknown');
      }
    };

    getChannelInfo();
  }, [message.channel_id, message.channel]);

  const toggleRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = message.is_read ? 'unread' : 'read';
      const response = await fetch(`${API_URL}/api/v1/messages/${message.id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to update message');
      
      toast.success(`Marked as ${message.is_read ? 'unread' : 'read'}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const toggleFlag = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/messages/${message.id}/flag`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to flag message');
      
      toast.success(message.is_flagged ? 'Unflagged' : 'Flagged');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error flagging message:', error);
      toast.error('Failed to flag message');
    }
  };

  // Format the timestamp
  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown time';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, x: 5 }}
      className={`bg-white/5 backdrop-blur-sm rounded-xl border p-4 transition-all cursor-pointer ${
        message.is_read ? 'border-white/5' : 'border-indigo-500/30 bg-indigo-500/5'
      }`}
    >
      <div className="flex items-start gap-3">
        <button 
          onClick={toggleRead} 
          className="mt-1 flex-shrink-0 hover:scale-110 transition-transform"
          aria-label="Toggle read status"
        >
          {message.is_read ? (
            <Circle className="w-4 h-4 text-gray-400" />
          ) : (
            <CheckCircle className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`font-semibold truncate ${
              message.is_read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-700 dark:text-slate-200'
            }`}>
              {message.sender?.name || 'Unknown Sender'}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
              <Clock className="w-3 h-3" />
              {formatTime(message.sent_at)}
            </div>
          </div>
          
          <p className={`text-sm truncate ${
            message.is_read ? 'text-gray-400' : 'text-gray-300'
          }`}>
            {message.subject || 'No subject'}
          </p>
          <p className={`text-sm truncate ${
            message.is_read ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {message.body?.substring(0, 100)}...
          </p>
          
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-400 flex items-center gap-1">
              <span>{channelIcon}</span>
              <span>{channelName}</span>
            </span>
            <button 
              onClick={toggleFlag} 
              className="text-xs text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Toggle flag"
            >
              {message.is_flagged ? (
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              ) : (
                <Star className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
