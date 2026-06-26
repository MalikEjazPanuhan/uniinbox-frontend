import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GmailConnect({ onConnected }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setStatus('connecting');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('success');
    toast.success('✅ Gmail connected successfully!');
    if (onConnected) onConnected();
    setIsConnecting(false);
  };

  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-2xl p-6 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
          <Mail className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200">Gmail Connection</h3>
          <p className="text-sm text-gray-400">Connect your Gmail account</p>
        </div>
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 text-emerald-500 rounded-lg mb-4">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Connected successfully!</span>
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={isConnecting || status === 'success'}
        className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting...
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Connected
          </>
        ) : (
          <>
            <Mail className="w-5 h-5" />
            Connect Gmail
          </>
        )}
      </button>
    </div>
  );
}
