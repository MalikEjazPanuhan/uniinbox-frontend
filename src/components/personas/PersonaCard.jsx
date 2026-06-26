import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Star, MoreVertical, Edit2, Trash2, Power, PowerOff, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

const getColor = (type) => {
  const colors = {
    professional: 'from-blue-500 to-indigo-500',
    doctor: 'from-emerald-500 to-teal-500',
    realtor: 'from-amber-500 to-orange-500',
    banker: 'from-purple-500 to-pink-500',
    developer: 'from-cyan-500 to-blue-500',
    healthcare: 'from-emerald-500 to-teal-500',
  };
  return colors[type] || 'from-gray-500 to-gray-600';
};

export default function PersonaCard({ persona, onUpdate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/personas/${persona.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !persona.is_active })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      toast.success(`Persona ${persona.is_active ? 'deactivated' : 'activated'} successfully`);
      onUpdate();
      setShowMenu(false);
    } catch (error) {
      toast.error('Failed to update persona status');
    } finally {
      setLoading(false);
    }
  };

  const setDefault = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/personas/${persona.id}/set-default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to set default');
      
      toast.success('Persona set as default successfully');
      onUpdate();
      setShowMenu(false);
    } catch (error) {
      toast.error('Failed to set default persona');
    } finally {
      setLoading(false);
    }
  };

  const deletePersona = async () => {
    if (!confirm(`Are you sure you want to delete "${persona.name}"?`)) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/personas/${persona.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete persona');
      
      toast.success('Persona deleted successfully');
      onUpdate();
      setShowMenu(false);
    } catch (error) {
      toast.error('Failed to delete persona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 transition-all duration-300 relative"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColor(persona.persona_type)} flex items-center justify-center shadow-lg`}
            whileHover={{ rotate: 10, scale: 1.05 }}
          >
            <User className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{persona.name}</h3>
            <p className="text-xs text-gray-400 capitalize">{persona.persona_type}</p>
          </div>
        </div>

        {/* Three Dots Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            disabled={loading}
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-10"
              >
                <div className="py-1">
                  {/* Toggle Active/Inactive */}
                  <button
                    onClick={toggleActive}
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-slate-700 dark:text-slate-200"
                  >
                    {persona.is_active ? (
                      <>
                        <PowerOff className="w-4 h-4 text-red-400" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 text-emerald-400" />
                        Activate
                      </>
                    )}
                  </button>

                  {/* Set as Default */}
                  {!persona.is_default && (
                    <button
                      onClick={setDefault}
                      disabled={loading}
                      className="w-full px-4 py-2.5 text-sm text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-slate-700 dark:text-slate-200"
                    >
                      <Star className="w-4 h-4 text-yellow-400" />
                      Set as Default
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-white/10 transition-colors flex items-center gap-3 text-slate-700 dark:text-slate-200"
                  >
                    <Edit2 className="w-4 h-4 text-blue-400" />
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={deletePersona}
                    disabled={loading}
                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-red-500/10 transition-colors flex items-center gap-3 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Status Badges */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${
          persona.is_active 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {persona.is_active ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              Inactive
            </>
          )}
        </span>
        {persona.is_default && (
          <span className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3" /> Default
          </span>
        )}
        {persona.generated_by_ai && (
          <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            AI
          </span>
        )}
      </div>
    </motion.div>
  );
}
