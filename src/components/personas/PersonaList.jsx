import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import PersonaCard from './PersonaCard';
import PersonaCreator from './PersonaCreator';
import toast from 'react-hot-toast';

const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

export default function PersonaList() {
  const [showCreator, setShowCreator] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPersonas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/personas/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch personas');
      }

      const data = await response.json();
      setPersonas(data);
    } catch (error) {
      console.error('Error fetching personas:', error);
      toast.error('Failed to load personas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, [refreshKey]);

  const handleCreated = () => {
    setRefreshKey(prev => prev + 1);
    setShowCreator(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Personas
          </h1>
          <p className="text-gray-400 mt-1">Manage your AI communication personas</p>
          <p className="text-sm text-gray-500 mt-1">{personas.length} persona(s) found</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchPersonas}
            className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500/30 transition-colors"
          >
            🔄 Refresh
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreator(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            New Persona
          </motion.button>
        </div>
      </div>

      {personas.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No personas yet</p>
          <p className="text-sm">Create your first AI persona to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <PersonaCard 
              key={persona.id} 
              persona={persona} 
              onUpdate={fetchPersonas}  // ← Added this
            />
          ))}
        </div>
      )}

      {showCreator && (
        <PersonaCreator 
          onClose={() => setShowCreator(false)} 
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
