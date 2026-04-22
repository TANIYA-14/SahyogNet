import { useState, useEffect } from 'react';
import { getMatches, createAssignment, getNeedById } from '../api';

export default function Matches({ needId, onBack }) {
  const [need, setNeed] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (needId) {
      fetchData();
    }
  }, [needId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [needData, matchesData] = await Promise.all([
        getNeedById(needId),
        getMatches(needId)
      ]);
      setNeed(needData);
      setMatches(matchesData);
    } catch (error) {
      console.error("Failed to load match data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (volunteerId, score) => {
    try {
      setAssigning(true);
      await createAssignment({ need_id: needId, volunteer_id: volunteerId, match_score: score });
      onBack(); // Go back to dashboard after successful assignment
    } catch (error) {
      console.error("Failed to assign volunteer", error);
      alert("Failed to assign volunteer.");
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <h2 className="text-xl text-gray-700 font-medium">Gemini AI is analyzing volunteers...</h2>
        <p className="text-gray-500 mt-2">Finding the best matches based on skills, zone, and urgency.</p>
      </div>
    );
  }

  if (!need) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Dashboard
      </button>

      {/* Need Details Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 border-l-4 border-l-blue-600">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-1 block">Selected Need</span>
            <h2 className="text-2xl font-bold text-gray-800">{need.category}</h2>
            <p className="text-gray-600 mt-2 text-lg">{need.description}</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mb-2">{need.zone}</span>
            <p className="text-sm font-medium text-gray-500">Urgency Level: <span className="text-gray-800">{need.urgency}/4</span></p>
          </div>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="bg-blue-600 w-2 h-6 rounded-full mr-3"></div>
        <h3 className="text-xl font-bold text-gray-800">Top Volunteer Matches</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {matches.map((match, index) => (
          <div key={match.volunteer.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col relative transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            {index === 0 && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-wider shadow-sm">
                ⭐ Best Match
              </div>
            )}
            <div className={`p-6 flex-grow flex flex-col ${index === 0 ? 'pt-10' : ''}`}>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{match.volunteer.name}</h4>
                  <p className="text-sm text-gray-500 font-medium">{match.volunteer.zone}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-4xl font-extrabold ${match.score >= 80 ? 'text-green-500' : match.score >= 60 ? 'text-blue-500' : 'text-gray-500'}`}>
                    {match.score}%
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Match</span>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {match.volunteer.skills.split(',').map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 font-medium rounded text-xs border border-gray-200">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl mb-6 flex-grow border border-blue-100">
                <p className="text-sm text-blue-800 font-medium leading-relaxed">"{match.reason}"</p>
              </div>

              <button
                onClick={() => handleAssign(match.volunteer.id, match.score)}
                disabled={assigning}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {assigning ? 'Assigning...' : 'Assign Volunteer'}
              </button>
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="col-span-3 text-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">No available volunteers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
