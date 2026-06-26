import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ChannelCard from './ChannelCard';
import toast from 'react-hot-toast';

const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

const AVAILABLE_CHANNELS = [
  { type: 'gmail', name: 'Gmail', icon: '📧' },
  { type: 'slack', name: 'Slack', icon: '💬' },
  { type: 'whatsapp', name: 'WhatsApp', icon: '📱' },
  { type: 'teams', name: 'Microsoft Teams', icon: '💼' },
];

export default function ChannelList() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChannels = async () => {
    console.log('🔄 Fetching channels...');
    try {
      const token = localStorage.getItem('token');
      console.log('📝 Token exists?', !!token);
      
      if (!token) {
        console.log('❌ No token found');
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/channels/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Response status:', response.status);

      if (response.status === 401) {
        console.log('🔑 Token expired');
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ Error response:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch channels');
      }

      const data = await response.json();
      console.log('✅ Channels data:', data);
      setChannels(data);
    } catch (error) {
      console.error('❌ Fetch error:', error);
      toast.error(error.message || 'Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const getChannelStatus = (type) => {
    const existing = channels.find(ch => ch.channel_type === type);
    return existing || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="ml-2 text-gray-400">Loading channels...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Channels
          </h1>
          <p className="text-gray-400 mt-1">Connect your communication channels</p>
          <p className="text-sm text-gray-500 mt-1">
            {channels.filter(c => c.is_active).length} of {AVAILABLE_CHANNELS.length} connected
          </p>
        </div>
        <button 
          onClick={fetchChannels}
          className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500/30 transition-colors text-sm flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AVAILABLE_CHANNELS.map((available, index) => {
          const connected = getChannelStatus(available.type);
          const channel = connected || { 
            id: null, 
            channel_type: available.type, 
            channel_name: available.name,
            is_active: false 
          };
          
          return (
            <ChannelCard 
              key={available.type}
              channel={channel}
              index={index}
              onUpdate={fetchChannels}
            />
          );
        })}
      </div>
    </div>
  );
}
