import { useState } from 'react';
import ContractIntelligenceHub from './components/ContractIntelligenceHub';
import ItineraryTimeline from './components/ItineraryTimeline';
import { Hotel, Calendar, Search } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'itinerary'>('contracts');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Hotel className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Q2 Travel</span>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('contracts')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'contracts'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Contract Intelligence</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'itinerary'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Itinerary Timeline</span>
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Tour Operator Hub</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {activeTab === 'contracts' && <ContractIntelligenceHub />}
        {activeTab === 'itinerary' && <ItineraryTimeline />}
      </main>
    </div>
  );
}

export default App