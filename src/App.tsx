import { useState, useEffect } from 'react';
import ContractIntelligenceHub from './components/ContractIntelligenceHub';
import ItineraryTimeline from './components/ItineraryTimeline';
import CommissionCalculator from './components/CommissionCalculator';
import ClientBookingHistory from './components/ClientBookingHistory';
import { Calendar, Search, DollarSign, Users, Clock } from 'lucide-react';
import q2Logo from '../assets/q2logo.png';

function App() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'itinerary' | 'commission' | 'clients'>('contracts');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <img src={q2Logo} alt="Q2 Travel" className="h-8 w-auto" />
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
                
                <button
                  onClick={() => setActiveTab('commission')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'commission'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Commission Calculator</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'clients'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Client History</span>
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleString('en-ZA', { 
                  timeZone: 'Africa/Johannesburg',
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                <span className="text-gray-400">SAST</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {activeTab === 'contracts' && <ContractIntelligenceHub />}
        {activeTab === 'itinerary' && <ItineraryTimeline />}
        {activeTab === 'commission' && <CommissionCalculator />}
        {activeTab === 'clients' && <ClientBookingHistory />}
      </main>
    </div>
  );
}

export default App