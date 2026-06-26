import { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import MessageCard from './MessageCard';
import toast from 'react-hot-toast';

const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

export default function MessageList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/messages/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(msg =>
    msg.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.body?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="ml-2 text-gray-400">Loading messages...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-gray-400 mt-1">Your unified inbox across all channels</p>
          <p className="text-sm text-gray-500 mt-1">{messages.length} message(s)</p>
        </div>
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No messages found</p>
            <p className="text-sm">Connect a channel to start receiving messages</p>
          </div>
        ) : (
          filteredMessages.map((message, index) => (
            <MessageCard key={message.id} message={message} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
