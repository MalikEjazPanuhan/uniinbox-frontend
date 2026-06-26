import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Loader2, Mail, User } from 'lucide-react';
import MITLReview from '../components/ai/MITLReview';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [messages, setMessages] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/v1/personas/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPersonas(data);
          if (data.length > 0) {
            setSelectedPersona(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching personas:', error);
      }
    };
    fetchPersonas();
  }, []);

  const handleGenerateSuggestion = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a message first');
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/v1/ai/draft`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          persona_id: selectedPersona || null,
          purpose: prompt,
          recipient: recipientEmail || 'recipient',
          key_points: [],
          tone: 'professional',
          length: 'medium'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate suggestion');
      }

      const data = await response.json();
      
      const persona = personas.find(p => p.id === selectedPersona);
      const personaName = persona?.name || 'AI Assistant';
      
      setSuggestion({
        id: Date.now() + 1,
        content: data.draft || 'Generated response based on your request.',
        confidence: 0.85,
        persona: personaName,
        role: 'assistant'
      });
      
      toast.success('✨ AI suggestion generated!');
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast.error(error.message || 'Failed to generate AI suggestion');
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (content) => {
    if (!recipientEmail) {
      toast.error('Please enter a recipient email address');
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      
      // Get Gmail channel
      const channelsResponse = await fetch(`${API_URL}/api/v1/channels/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!channelsResponse.ok) {
        throw new Error('Failed to get channels');
      }
      
      const channels = await channelsResponse.json();
      const gmailChannel = channels.find(c => c.channel_type === 'gmail' && c.is_active);
      
      if (!gmailChannel) {
        toast.error('Please connect Gmail first');
        setIsSending(false);
        return;
      }

      // Save message to database
      const messageData = {
        subject: `Re: ${prompt.substring(0, 50)}`,
        body: content,
        sender: {
          email: user?.email || 'user@uniinbox.ai',
          name: user?.full_name || 'User'
        },
        recipients: [
          {
            email: recipientEmail,
            name: 'Recipient'
          }
        ],
        sent_at: new Date().toISOString(),
        channel_id: gmailChannel.id
      };

      const response = await fetch(`${API_URL}/api/v1/messages/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to save message');
      }

      toast.success('✅ Message sent and saved!');
      
      // Add to chat messages
      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `✅ Email sent to ${recipientEmail}\n\n${content}`,
        timestamp: new Date().toISOString(),
        persona: suggestion?.persona || 'AI Assistant'
      };
      setMessages(prev => [...prev, aiMessage]);
      
      setSuggestion(null);
      setPrompt('');
      setRecipientEmail('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleReject = () => {
    setSuggestion(null);
    toast.info('Suggestion discarded. Try a different approach.');
    setMessages(prev => prev.filter(m => m.id !== suggestion?.id));
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
          <Bot className="w-8 h-8" />
          AI Assistant
        </h1>
        <p className="text-gray-400 mt-1">AI-powered communication with Man-in-the-Loop review</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-full px-3 py-1 inline-flex">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Gmail MITL Active
        </div>
      </motion.div>

      <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 flex flex-col overflow-hidden">
        <div className="mb-4 flex items-center gap-4">
          <label className="text-sm text-gray-400">Using Persona:</label>
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 text-sm"
          >
            {personas.length === 0 ? (
              <option value="">No personas available</option>
            ) : (
              personas.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))
            )}
          </select>
          <span className="text-xs text-gray-500">{personas.length} persona(s) available</span>
        </div>

        <div className="bg-indigo-500/10 rounded-xl p-4 mb-4 border border-indigo-500/20">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-sm font-medium text-indigo-400">Man-in-the-Loop Active</p>
              <p className="text-xs text-gray-400">AI suggests → You review → Approve/Edit before sending to Gmail</p>
            </div>
          </div>
        </div>

        {/* Recipient Email Input */}
        <div className="mb-4">
          <label className="text-sm text-gray-400 block mb-1">Recipient Email:</label>
          <input
            type="email"
            placeholder="Enter recipient email address"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-gray-400 text-sm"
            disabled={isSending}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && !suggestion && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-400">Enter a request below to generate an AI response</p>
              <p className="text-xs text-gray-500 mt-1">AI will suggest a response that you can review, edit, and approve</p>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}>
                {msg.role === 'assistant' && msg.persona && (
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                    <User className="w-3 h-3" />
                    <span>{msg.persona}</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs opacity-50 mt-1">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                </p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                <span className="text-sm text-gray-400">AI is thinking...</span>
              </div>
            </div>
          )}

          {suggestion && (
            <div className="flex justify-start">
              <MITLReview
                suggestion={suggestion}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={isSending}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/10 pt-4 flex gap-3">
          <input
            type="text"
            placeholder="What would you like to respond to?"
            className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-gray-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateSuggestion()}
            disabled={!!suggestion || loading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateSuggestion}
            disabled={loading || !prompt.trim() || !!suggestion}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Generate
          </motion.button>
        </div>
      </div>
    </div>
  );
}
