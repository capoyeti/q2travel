import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, Star, TrendingUp, AlertCircle, Check, Download, Filter, MapPin, Activity, Info, FileText, ShoppingCart, X, Plus, Minus } from 'lucide-react';

const ContractIntelligenceHub = () => {
  const [activeTab, setActiveTab] = useState('hotel-search');
  const [searchType, setSearchType] = useState('specific');
  const [showResults, setShowResults] = useState(false);
  const [preferredOnly, setPreferredOnly] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [quoteItems, setQuoteItems] = useState([]);
  const [showQuotePanel, setShowQuotePanel] = useState(false);

  // Get current season rate
  const getCurrentSeasonRate = (hotelName, rateType = 'double') => {
    const contract = mockContract[hotelName];
    if (!contract) return 0;
    
    const currentMonth = new Date().getMonth();
    const seasonMap = {
      0: "Jan-Mar", 1: "Jan-Mar", 2: "Jan-Mar",
      3: "Apr-Jun", 4: "Apr-Jun", 5: "Apr-Jun",
      6: "Jul-Sep", 7: "Jul-Sep", 8: "Jul-Sep",
      9: "Oct-Dec", 10: "Oct-Dec", 11: "Oct-Dec"
    };
    const currentSeason = seasonMap[currentMonth];
    return contract.rateCard[currentSeason][rateType];
  };

  const mockContract = {
    "Sabi Sands Safari Lodge": {
      contractNumber: "SS-2025-001",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      rateCard: {
        "Jan-Mar": { single: 480, double: 520, child: 260 },
        "Apr-Jun": { single: 420, double: 460, child: 230 },
        "Jul-Sep": { single: 580, double: 620, child: 310 },
        "Oct-Dec": { single: 520, double: 560, child: 280 }
      },
      terms: [
        { 
          id: 1, 
          category: "rates", 
          text: "All rates are per person per night sharing, includes meals and game drives",
          relevant: true,
          type: "standard"
        },
        { 
          id: 2, 
          category: "discounts", 
          text: "3+ consecutive nights: 15% discount applies automatically",
          relevant: true,
          type: "opportunity"
        },
        { 
          id: 3, 
          category: "supplements", 
          text: "Single supplement: 75% of double rate",
          relevant: false,
          type: "standard"
        },
        { 
          id: 4, 
          category: "cancellation", 
          text: "45 days prior: 10% penalty | 30 days: 50% penalty | 14 days: 100% penalty",
          relevant: true,
          type: "warning"
        },
        { 
          id: 5, 
          category: "payment", 
          text: "50% deposit required within 7 days of confirmation",
          relevant: true,
          type: "standard"
        },
        { 
          id: 6, 
          category: "dodgy", 
          text: "Rate increases of up to 15% may apply with 30 days notice during peak season",
          relevant: true,
          type: "warning"
        },
        { 
          id: 7, 
          category: "seasonal", 
          text: "December 20-31: Additional 25% peak season supplement applies",
          relevant: true,
          type: "warning"
        },
        { 
          id: 8, 
          category: "inclusions", 
          text: "Includes: All meals, game drives, conservation fees, transfers from local airstrip",
          relevant: true,
          type: "standard"
        },
        { 
          id: 9, 
          category: "exclusions", 
          text: "Excludes: Beverages, premium wines, spa treatments, private game drives",
          relevant: true,
          type: "standard"
        },
        { 
          id: 10, 
          category: "dodgy", 
          text: "Force majeure clause: No refunds for government restrictions or natural disasters",
          relevant: false,
          type: "warning"
        }
      ],
      specialOffers: [
        {
          title: "Early Bird Special",
          description: "Book 60 days in advance for 10% additional discount",
          validPeriod: "Valid for stays Apr-Jun 2025",
          conditions: "Cannot be combined with other offers"
        }
      ]
    },
    "Thornybush Game Lodge": {
      contractNumber: "TG-2025-003",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      rateCard: {
        "Jan-Mar": { single: 380, double: 420, child: 210 },
        "Apr-Jun": { single: 340, double: 380, child: 190 },
        "Jul-Sep": { single: 460, double: 500, child: 250 },
        "Oct-Dec": { single: 340, double: 380, child: 190 }
      },
      terms: [
        { 
          id: 1, 
          category: "rates", 
          text: "All rates per person per night, full board + 2 game drives daily",
          relevant: true,
          type: "standard"
        },
        { 
          id: 2, 
          category: "promo", 
          text: "DECEMBER SPECIAL: 20% off all bookings for Dec 2025 stays (expires Dec 31)",
          relevant: true,
          type: "opportunity"
        },
        { 
          id: 3, 
          category: "cancellation", 
          text: "30 days prior: 25% penalty | 14 days: 75% penalty | 7 days: 100% penalty",
          relevant: true,
          type: "warning"
        },
        { 
          id: 4, 
          category: "dodgy", 
          text: "Weather cancellations: Lodge credits only, no cash refunds",
          relevant: false,
          type: "warning"
        },
        { 
          id: 5, 
          category: "payment", 
          text: "Full payment required 30 days before arrival",
          relevant: true,
          type: "standard"
        }
      ],
      specialOffers: [
        {
          title: "December Promotion",
          description: "20% discount on all December 2025 bookings",
          validPeriod: "Valid until Dec 31, 2025",
          conditions: "Subject to availability, advance booking required"
        }
      ]
    },
    "Kruger Bush Camp Premium": {
      contractNumber: "KBC-2025-002",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      rateCard: {
        "Jan-Mar": { single: 260, double: 290, child: 145 },
        "Apr-Jun": { single: 240, double: 270, child: 135 },
        "Jul-Sep": { single: 300, double: 330, child: 165 },
        "Oct-Dec": { single: 280, double: 310, child: 155 }
      },
      terms: [
        { 
          id: 1, 
          category: "rates", 
          text: "All rates per person per night, includes meals and shared game drives",
          relevant: true,
          type: "standard"
        },
        { 
          id: 2, 
          category: "partnership", 
          text: "NEW PARTNERSHIP: 30% discount on all bookings through Q2 Travel",
          relevant: true,
          type: "opportunity"
        },
        { 
          id: 3, 
          category: "family", 
          text: "Children under 12: 50% discount, under 6: Free (sharing with parents)",
          relevant: false,
          type: "standard"
        },
        { 
          id: 4, 
          category: "cancellation", 
          text: "21 days prior: No charge | 14 days: 50% penalty | 7 days: 100% penalty",
          relevant: true,
          type: "standard"
        }
      ],
      specialOffers: [
        {
          title: "Partnership Launch Special",
          description: "30% off all Q2 Travel bookings for first 6 months",
          validPeriod: "Valid until June 30, 2025",
          conditions: "Exclusive to Q2 Travel clients"
        }
      ]
    },
    "Madikwe Safari Lodge": {
      contractNumber: "MSL-2025-007",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      rateCard: {
        "Jan-Mar": { single: 400, double: 425, child: 213 },
        "Apr-Jun": { single: 370, double: 395, child: 198 },
        "Jul-Sep": { single: 450, double: 475, child: 238 },
        "Oct-Dec": { single: 400, double: 425, child: 213 }
      },
      terms: [
        { 
          id: 1, 
          category: "rates", 
          text: "All rates per person per night, full board + conservation activities",
          relevant: true,
          type: "standard"
        },
        { 
          id: 2, 
          category: "health", 
          text: "MALARIA-FREE zone - no prophylaxis required",
          relevant: true,
          type: "opportunity"
        },
        { 
          id: 3, 
          category: "family", 
          text: "Family-friendly lodge with specialized children's programs",
          relevant: false,
          type: "standard"
        },
        { 
          id: 4, 
          category: "cancellation", 
          text: "45 days prior: 15% penalty | 21 days: 50% penalty | 7 days: 100% penalty",
          relevant: true,
          type: "warning"
        }
      ],
      specialOffers: [
        {
          title: "Malaria-Free Advantage",
          description: "Perfect for families and health-conscious travelers",
          validPeriod: "Year-round benefit",
          conditions: "No additional cost"
        }
      ]
    }
  };

  const mockResults = {
    preferred: [
      {
        name: "Sabi Sands Safari Lodge",
        rate: `$${getCurrentSeasonRate("Sabi Sands Safari Lodge")}/night`,
        originalRate: `$${getCurrentSeasonRate("Sabi Sands Safari Lodge")}/night`,
        bookingHistory: 23,
        lastUsed: "2 months ago",
        rating: 4.8,
        experience: ["Big 5", "Bush Safari", "Luxury"],
        specialTerms: "Free game drives, 3+ nights get 15% off",
        confidence: 98,
        location: "Sabi Sands, South Africa",
        availability: "Available",
        appliedRate: "Current season rate (July-September)",
        rateType: "double"
      },
      {
        name: "Thornybush Game Lodge",
        rate: `$${Math.floor(getCurrentSeasonRate("Thornybush Game Lodge") * 0.8)}/night`,
        originalRate: `$${getCurrentSeasonRate("Thornybush Game Lodge")}/night`,
        bookingHistory: 18,
        lastUsed: "1 month ago",
        rating: 4.6,
        experience: ["Big 5", "Bush Safari"],
        specialTerms: "20% off December bookings - ends soon!",
        confidence: 95,
        location: "Thornybush, South Africa",
        availability: "Available",
        savings: 20,
        appliedRate: "Base rate with 20% December special",
        rateType: "double"
      }
    ],
    alternatives: [
      {
        name: "Kruger Bush Camp Premium",
        rate: "$290/night",
        originalRate: "$290/night",
        bookingHistory: 0,
        rating: 4.4,
        experience: ["Big 5", "Bush Safari", "Family"],
        specialTerms: "New partnership - 30% savings vs usual",
        confidence: 87,
        location: "Kruger National Park",
        availability: "Available",
        savings: 30,
        note: "Similar quality to your preferred Sabi Sands",
        appliedRate: "Promotional partnership rate",
        rateType: "double"
      },
      {
        name: "Madikwe Safari Lodge",
        rate: "$425/night",
        originalRate: "$425/night",
        bookingHistory: 2,
        rating: 4.5,
        experience: ["Big 5", "Bush Safari", "Malaria-free"],
        specialTerms: "Child-friendly, malaria-free zone",
        confidence: 92,
        location: "Madikwe Game Reserve",
        availability: "Available",
        note: "Higher rate but malaria-free advantage",
        appliedRate: "Standard seasonal rate",
        rateType: "double"
      }
    ]
  };

  const tooltips = {
    confidence: {
      title: "AI Confidence Score",
      description: "Indicates how accurately our AI extracted data from the contract. 95%+ means high confidence in rate accuracy and term interpretation. Lower scores may need manual verification."
    },
    bookingHistory: {
      title: "Your Booking History",
      description: "How many times you've successfully booked this hotel through our system. Higher numbers indicate trusted partnerships and familiarity with their processes."
    },
    specialTerms: {
      title: "Key Contract Terms",
      description: "Important conditions, discounts, or special offers extracted from the full contract. Click 'View Contract' to see complete terms and conditions."
    }
  };

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleViewContract = (hotel) => {
    setSelectedHotel(hotel);
    setShowContractModal(true);
  };

  // Quote management functions
  const addToQuote = (hotel) => {
    const existingItem = quoteItems.find(item => item.name === hotel.name);
    if (existingItem) {
      // Increase quantity if already in quote
      setQuoteItems(quoteItems.map(item =>
        item.name === hotel.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item to quote
      setQuoteItems([...quoteItems, {
        ...hotel,
        quantity: 1,
        nights: 1,
        guests: 2
      }]);
    }
    setShowQuotePanel(true);
  };

  const updateQuoteItem = (hotelName, field, value) => {
    setQuoteItems(quoteItems.map(item =>
      item.name === hotelName
        ? { ...item, [field]: parseInt(value) || 1 }
        : item
    ));
  };

  const removeFromQuote = (hotelName) => {
    setQuoteItems(quoteItems.filter(item => item.name !== hotelName));
  };

  const calculateQuoteTotal = () => {
    return quoteItems.reduce((total, item) => {
      const rateMatch = item.rate.match(/\$(\d+)/);
      const rate = rateMatch ? parseInt(rateMatch[1]) : 0;
      return total + (rate * item.quantity * item.nights * item.guests);
    }, 0);
  };

  const calculateCommission = (total, percentage = 15) => {
    return Math.round(total * percentage / 100);
  };

  const Tooltip = ({ children, content, id }) => (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(id)}
        onMouseLeave={() => setShowTooltip(null)}
        className="cursor-help"
      >
        {children}
      </div>
      {showTooltip === id && (
        <div className="absolute z-50 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg -top-2 left-full ml-2">
          <div className="font-semibold mb-1">{content.title}</div>
          <div>{content.description}</div>
          <div className="absolute top-3 left-0 transform -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900"></div>
        </div>
      )}
    </div>
  );

  const ContractModal = ({ hotel, onClose }) => {
    const contract = mockContract[hotel.name];
    if (!contract) return null;

    const currentMonth = new Date().getMonth();
    const seasonMap = {
      0: "Jan-Mar", 1: "Jan-Mar", 2: "Jan-Mar",
      3: "Apr-Jun", 4: "Apr-Jun", 5: "Apr-Jun",
      6: "Jul-Sep", 7: "Jul-Sep", 8: "Jul-Sep",
      9: "Oct-Dec", 10: "Oct-Dec", 11: "Oct-Dec"
    };
    const currentSeason = seasonMap[currentMonth];

    // Prevent background scrolling when modal is open
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8 mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-900">{hotel.name} - Contract Analysis</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          
          <div className="p-6">
            {/* Rate Calculation Summary */}
            <div className="bg-blue-50 border-l-4 border-l-blue-500 p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Quoted Rate Breakdown</h3>
                  <div className="text-sm text-blue-800">
                    <div className="mb-1">
                      <span className="font-medium">Base Rate:</span> ${contract.rateCard[currentSeason].double}/night ({currentSeason} season)
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Rate Type:</span> Double occupancy, per person
                    </div>
                    {hotel.savings && (
                      <div className="mb-1 text-green-700">
                        <span className="font-medium">Applied Discount:</span> {hotel.savings}% off current promotion
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <span className="font-medium text-blue-900">Final Rate: {hotel.rate}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <a 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    View Original Contract PDF
                  </a>
                  <div className="text-xs text-blue-600 mt-1">Contract #{contract.contractNumber}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Rate Card */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Seasonal Rate Card</h3>
                <div className="space-y-3">
                  {Object.entries(contract.rateCard).map(([season, rates]) => {
                    const isCurrentSeason = season === currentSeason;
                    const isQuotedRate = isCurrentSeason && rates.double === getCurrentSeasonRate(hotel.name);
                    
                    return (
                      <div 
                        key={season} 
                        className={`p-3 rounded border-l-4 ${
                          isCurrentSeason 
                            ? 'border-l-green-500 bg-green-50' 
                            : 'border-l-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">{season}</span>
                          <div className="flex gap-2">
                            {isCurrentSeason && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Current Period
                              </span>
                            )}
                            {isQuotedRate && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                ★ Quoted Rate
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                          <div className={isCurrentSeason ? 'font-medium text-green-800' : ''}>
                            Single: ${rates.single}
                          </div>
                          <div className={isCurrentSeason && isQuotedRate ? 'font-bold text-blue-800' : isCurrentSeason ? 'font-medium text-green-800' : ''}>
                            Double: ${rates.double} {isQuotedRate && '← Base rate'}
                          </div>
                          <div className={isCurrentSeason ? 'font-medium text-green-800' : ''}>
                            Child: ${rates.child}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  <strong>Note:</strong> Rates shown are per person per night. Final quote may include applicable discounts and supplements.
                </div>
              </div>

              {/* Special Offers */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Special Offers</h3>
                <div className="space-y-3">
                  {contract.specialOffers.map((offer, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border-l-4 border-l-blue-500">
                      <div className="font-medium text-blue-900">{offer.title}</div>
                      <div className="text-sm text-gray-700 mt-1">{offer.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{offer.validPeriod}</div>
                      <div className="text-xs text-gray-500">{offer.conditions}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Terms */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Contract Terms & Conditions</h3>
                <div className="space-y-2">
                  {contract.terms.map((term) => (
                    <div 
                      key={term.id} 
                      className={`p-3 rounded border-l-4 ${
                        term.relevant 
                          ? term.type === 'opportunity' 
                            ? 'border-l-green-500 bg-green-50' 
                            : term.type === 'warning'
                            ? 'border-l-red-500 bg-red-50'
                            : 'border-l-blue-500 bg-blue-50'
                          : 'border-l-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              {term.category}
                            </span>
                            {term.relevant && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Applies to Your Search
                              </span>
                            )}
                            {term.type === 'opportunity' && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Opportunity
                              </span>
                            )}
                            {term.type === 'warning' && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                Important
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            term.relevant ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {term.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Metadata */}
              <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contract Information</h3>
                  <div className="flex gap-2">
                    <a 
                      href="#" 
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Download Original PDF
                    </a>
                    <a 
                      href="#" 
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Info className="w-4 h-4" />
                      Contract History
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Contract Number:</span>
                    <div className="text-gray-600 font-mono">{contract.contractNumber}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Valid From:</span>
                    <div className="text-gray-600">{contract.validFrom}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Valid To:</span>
                    <div className="text-gray-600">{contract.validTo}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <div className="text-gray-600">Jan 15, 2025</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border text-xs text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">File Location:</span>
                  </div>
                  <code className="text-gray-500">
                    /OneDrive/Contracts/2025/Safari_Lodges/{hotel.name.replace(/\s+/g, '_')}_2025.pdf
                  </code>
                </div>
              </div>

            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Export Relevant Terms
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ExperienceTag = ({ type, color = "blue" }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
      {type}
    </span>
  );

  const HotelCard = ({ hotel, isPreferred }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${isPreferred ? 'border-l-green-500' : 'border-l-blue-500'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
            {isPreferred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            {hotel.savings && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                {hotel.savings}% OFF
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{hotel.location}</span>
            <span className="mx-2">•</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              {hotel.rating}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            {hotel.experience.map((exp, idx) => (
              <ExperienceTag key={idx} type={exp} />
            ))}
          </div>
          {hotel.note && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>{hotel.note}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{hotel.rate}</div>
          {hotel.originalRate !== hotel.rate && (
            <div className="text-sm text-gray-500 line-through">{hotel.originalRate}</div>
          )}
          <div className="text-sm text-gray-600 mt-1">per person</div>
          {hotel.appliedRate && (
            <div className="text-xs text-blue-600 mt-1">{hotel.appliedRate}</div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700">Contract Terms:</span>
          <Tooltip content={tooltips.specialTerms} id={`terms-${hotel.name}`}>
            <AlertCircle className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <div className="text-sm text-gray-600">{hotel.specialTerms}</div>
      </div>

      {isPreferred && (
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <Tooltip content={tooltips.bookingHistory} id={`history-${hotel.name}`}>
            <span className="cursor-help">Used {hotel.bookingHistory} times</span>
          </Tooltip>
          <span>•</span>
          <span>Last booking: {hotel.lastUsed}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${hotel.confidence > 95 ? 'bg-green-500' : hotel.confidence > 85 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
          <Tooltip content={tooltips.confidence} id={`confidence-${hotel.name}`}>
            <span className="text-sm text-gray-600 cursor-help">{hotel.confidence}% confidence</span>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => addToQuote(hotel)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add to Quote
          </button>
          <button 
            onClick={() => handleViewContract(hotel)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            View Contract
          </button>
        </div>
      </div>
    </div>
  );

  // Quote Panel Component
  const QuotePanel = () => {
    const total = calculateQuoteTotal();
    const commission = calculateCommission(total);
    const netTotal = total - commission;

    return (
      <div className={`fixed right-0 top-0 h-full bg-white shadow-xl transform transition-transform z-40 ${
        showQuotePanel ? 'translate-x-0' : 'translate-x-full'
      } w-96`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Quote Builder</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {quoteItems.length} items
            </span>
          </div>
          <button
            onClick={() => setShowQuotePanel(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100% - 240px)' }}>
          {quoteItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No items in quote yet</p>
              <p className="text-sm mt-1">Add hotels to start building your quote</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quoteItems.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.location}</p>
                    </div>
                    <button
                      onClick={() => removeFromQuote(item.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <label className="text-gray-600">Nights</label>
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => updateQuoteItem(item.name, 'nights', Math.max(1, item.nights - 1))}
                          className="w-6 h-6 rounded border hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3 mx-auto" />
                        </button>
                        <input
                          type="number"
                          value={item.nights}
                          onChange={(e) => updateQuoteItem(item.name, 'nights', e.target.value)}
                          className="w-12 text-center border rounded"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuoteItem(item.name, 'nights', item.nights + 1)}
                          className="w-6 h-6 rounded border hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3 mx-auto" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-600">Rooms</label>
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => updateQuoteItem(item.name, 'quantity', Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 rounded border hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3 mx-auto" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuoteItem(item.name, 'quantity', e.target.value)}
                          className="w-12 text-center border rounded"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuoteItem(item.name, 'quantity', item.quantity + 1)}
                          className="w-6 h-6 rounded border hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3 mx-auto" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-600">Guests</label>
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => updateQuoteItem(item.name, 'guests', Math.max(1, item.guests - 1))}
                          className="w-6 h-6 rounded border hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3 mx-auto" />
                        </button>
                        <input
                          type="number"
                          value={item.guests}
                          onChange={(e) => updateQuoteItem(item.name, 'guests', e.target.value)}
                          className="w-12 text-center border rounded"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuoteItem(item.name, 'guests', item.guests + 1)}
                          className="w-6 h-6 rounded border hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      ${parseInt(item.rate.match(/\$(\d+)/)?.[1] || 0) * item.nights * item.quantity * item.guests}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Commission (15%):</span>
              <span className="font-medium text-green-600">-${commission.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Net Total:</span>
              <span>${netTotal.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export Quote
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Q2 Travel Intelligence Hub</h1>
                <p className="text-gray-600">Contract Analysis & Experience Matching</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">2,847</span> contracts processed
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">98.4%</span> accuracy rate
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Query Interface */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSearchType('specific')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchType === 'specific' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Specific Hotels
              </button>
              <button
                onClick={() => setSearchType('experience')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  searchType === 'experience' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Experience-Based
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={preferredOnly}
                  onChange={(e) => setPreferredOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Preferred hotels only
              </label>
            </div>
          </div>

          {searchType === 'specific' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hotels</label>
                <input
                  type="text"
                  placeholder="e.g., Sabi Sands, Thornybush"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <input
                  type="text"
                  placeholder="2 adults, 1 child"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Big 5 Safari</option>
                  <option>Bush Safari</option>
                  <option>Adventure Activities</option>
                  <option>Cultural Heritage</option>
                  <option>Luxury Escape</option>
                  <option>Family Safari</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <input
                  type="text"
                  placeholder="2 adults, 1 child"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search Contracts
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {!preferredOnly && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    Your Preferred Hotels
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Export to Quote System
                  </button>
                </div>

                <div className="grid gap-4">
                  {mockResults.preferred.map((hotel, idx) => (
                    <HotelCard key={idx} hotel={hotel} isPreferred={true} />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Similar Quality Alternatives
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      (Better rates this period)
                    </span>
                  </h2>
                </div>

                <div className="grid gap-4">
                  {mockResults.alternatives.map((hotel, idx) => (
                    <HotelCard key={idx} hotel={hotel} isPreferred={false} />
                  ))}
                </div>
              </>
            )}

            {preferredOnly && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    Your Preferred Hotels Only
                  </h2>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Export to Quote System
                  </button>
                </div>

                <div className="grid gap-4">
                  {mockResults.preferred.map((hotel, idx) => (
                    <HotelCard key={idx} hotel={hotel} isPreferred={true} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Contract Modal */}
      {showContractModal && selectedHotel && (
        <ContractModal 
          hotel={selectedHotel} 
          onClose={() => setShowContractModal(false)} 
        />
      )}

      {/* Quote Panel */}
      <QuotePanel />

      {/* Floating Quote Button */}
      {quoteItems.length > 0 && !showQuotePanel && (
        <button
          onClick={() => setShowQuotePanel(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="bg-white text-blue-600 text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {quoteItems.length}
          </span>
        </button>
      )}
    </div>
  );
};

export default ContractIntelligenceHub;