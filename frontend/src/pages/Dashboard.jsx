import { useState, useEffect } from 'react';
import { getNeeds } from '../api';

export default function Dashboard({ onMatch }) {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchNeeds();
  }, []);

  const fetchNeeds = async () => {
    try {
      const data = await getNeeds();
      setNeeds(data);
    } catch (error) {
      console.error("Failed to load needs", error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch(urgency) {
      case 4: return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Critical</span>;
      case 3: return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">High</span>;
      case 2: return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">Medium</span>;
      case 1: return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Low</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    const s = status || 'open';
    if (s === 'assigned') return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Assigned</span>;
    if (s === 'resolved') return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Resolved</span>;
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Open</span>;
  };

  const filteredNeeds = filter === 'All' ? needs : needs.filter(n => (n.status || 'open').toLowerCase() === filter.toLowerCase());

  const totalNeeds = needs.length;
  const openNeeds = needs.filter(n => (n.status || 'open') === 'open').length;
  const assignedNeeds = needs.filter(n => n.status === 'assigned').length;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Needs</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{totalNeeds}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Open Needs</p>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{openNeeds}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Assigned</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{assignedNeeds}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100 inline-flex">
        {['All', 'Open', 'Assigned', 'Resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Needs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading needs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-medium">Zone</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Urgency</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNeeds.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No needs found matching the filter.</td>
                  </tr>
                ) : (
                  filteredNeeds.map(need => (
                    <tr key={need.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-800 font-medium">{need.zone}</td>
                      <td className="p-4 text-gray-600">{need.category}</td>
                      <td className="p-4 text-gray-600 max-w-xs truncate" title={need.description}>{need.description}</td>
                      <td className="p-4">{getUrgencyBadge(need.urgency)}</td>
                      <td className="p-4">{getStatusBadge(need.status)}</td>
                      <td className="p-4 text-right">
                        {(need.status || 'open') === 'open' && (
                          <button 
                            onClick={() => onMatch(need.id)}
                            className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                          >
                            Find Matches
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
