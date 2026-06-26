import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'https://malik-2025-uniinbox-ai.hf.space';

const industries = [
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'real_estate', name: 'Real Estate', icon: '🏠' },
  { id: 'banking_finance', name: 'Banking & Finance', icon: '💰' },
  { id: 'software_development', name: 'Software Development', icon: '💻' },
  { id: 'legal', name: 'Legal', icon: '⚖️' },
  { id: 'education', name: 'Education', icon: '📚' },
];

export default function PersonaCreator({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    company: '',
    industry: 'healthcare',
    specialization: [],
    experience_years: 0,
    communication_style: 'professional',
    primary_audience: '',
    certifications: [],
    languages: ['en'],
    timezone: 'UTC',
    preferences: {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.job_title || !formData.primary_audience) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      // Step 1: Generate the persona using the real API
      const generateResponse = await fetch(`${API_URL}/api/v1/onboarding/generate-persona`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          onboarding_data: {
            full_name: formData.full_name,
            job_title: formData.job_title,
            company: formData.company || '',
            industry: formData.industry,
            specialization: formData.specialization || [],
            experience_years: parseInt(formData.experience_years) || 0,
            communication_style: formData.communication_style || 'professional',
            primary_audience: formData.primary_audience,
            certifications: formData.certifications || [],
            languages: ['en'],
            timezone: 'UTC',
            preferences: {}
          }
        })
      });

      if (!generateResponse.ok) {
        const error = await generateResponse.json();
        throw new Error(error.detail || 'Failed to generate persona');
      }

      const generateData = await generateResponse.json();
      
      // Step 2: Save the persona using the real API
      const saveResponse = await fetch(`${API_URL}/api/v1/onboarding/save-persona`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generateData.persona)
      });

      if (!saveResponse.ok) {
        const error = await saveResponse.json();
        throw new Error(error.detail || 'Failed to save persona');
      }

      toast.success('✨ Persona created successfully!');
      onCreated();
      onClose();
    } catch (error) {
      console.error('Persona creation error:', error);
      toast.error(error.message || 'Failed to create persona. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            ✨ Generate AI Persona
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-gray-400"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Dr. Sarah Johnson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-gray-400"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Cardiologist"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Company
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-gray-400"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="St. Mary's Hospital"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Industry *
            </label>
            <select
              required
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            >
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>{ind.icon} {ind.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Primary Audience *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 placeholder:text-gray-400"
              value={formData.primary_audience}
              onChange={(e) => setFormData({ ...formData, primary_audience: e.target.value })}
              placeholder="Patients, Clients, Students"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Persona
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
