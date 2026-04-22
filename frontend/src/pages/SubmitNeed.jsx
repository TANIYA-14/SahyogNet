import { useState } from 'react';
import { createNeed } from '../api';

export default function SubmitNeed() {
  const [formData, setFormData] = useState({
    zone: 'Zone A',
    category: 'Food',
    description: '',
    urgency: 1
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F', 'Zone G', 'Zone H'];
  const categories = ['Food', 'Medical', 'Education', 'Shelter', 'Clothing'];
  const urgencies = [
    { label: 'Low', value: 1 },
    { label: 'Medium', value: 2 },
    { label: 'High', value: 3 },
    { label: 'Critical', value: 4 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const result = await createNeed(formData);
      if (result.error) {
        setMessage(`Error: ${result.message}`);
      } else {
        setMessage('Need submitted successfully!');
        setFormData({ zone: 'Zone A', category: 'Food', description: '', urgency: 1 });
      }
    } catch (err) {
      setMessage('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit a Community Need</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
          <select 
            value={formData.zone}
            onChange={(e) => setFormData({...formData, zone: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            required
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            placeholder="Describe the specific need..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
          <div className="flex gap-4">
            {urgencies.map(u => (
              <label key={u.value} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="urgency" 
                  value={u.value}
                  checked={formData.urgency == u.value}
                  onChange={(e) => setFormData({...formData, urgency: Number(e.target.value)})}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{u.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300 disabled:opacity-70"
        >
          {loading ? 'Submitting...' : 'Submit Need'}
        </button>
      </form>
    </div>
  );
}
