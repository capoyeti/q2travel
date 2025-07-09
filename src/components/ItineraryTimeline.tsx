import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, AlertTriangle, Plus, X, GripVertical } from 'lucide-react';

interface ItineraryItem {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  rate: number;
  color: string;
}

interface Conflict {
  type: 'overlap' | 'gap' | 'same_day';
  items: string[];
  message: string;
}

const ItineraryTimeline: React.FC = () => {
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([
    {
      id: '1',
      hotelName: 'Sabi Sands Safari Lodge',
      location: 'Kruger National Park',
      checkIn: '2025-03-15',
      checkOut: '2025-03-18',
      nights: 3,
      guests: 2,
      rate: 520,
      color: 'bg-green-500'
    },
    {
      id: '2',
      hotelName: 'Thornybush Game Lodge',
      location: 'Thornybush Reserve',
      checkIn: '2025-03-20',
      checkOut: '2025-03-23',
      nights: 3,
      guests: 2,
      rate: 480,
      color: 'bg-blue-500'
    }
  ]);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  // Calculate total trip duration
  const calculateTotalDuration = () => {
    if (itineraryItems.length === 0) return { days: 0, nights: 0 };
    
    const sortedItems = [...itineraryItems].sort((a, b) => 
      new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
    );
    
    const firstCheckIn = new Date(sortedItems[0].checkIn);
    const lastCheckOut = new Date(sortedItems[sortedItems.length - 1].checkOut);
    const totalDays = Math.ceil((lastCheckOut.getTime() - firstCheckIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalNights = itineraryItems.reduce((sum, item) => sum + item.nights, 0);
    
    return { days: totalDays, nights: totalNights };
  };

  // Check for scheduling conflicts
  const checkConflicts = () => {
    const newConflicts: Conflict[] = [];
    const sortedItems = [...itineraryItems].sort((a, b) => 
      new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
    );

    for (let i = 0; i < sortedItems.length - 1; i++) {
      const current = sortedItems[i];
      const next = sortedItems[i + 1];
      const currentCheckOut = new Date(current.checkOut);
      const nextCheckIn = new Date(next.checkIn);
      
      // Check for overlaps
      if (currentCheckOut > nextCheckIn) {
        newConflicts.push({
          type: 'overlap',
          items: [current.id, next.id],
          message: `${current.hotelName} checkout overlaps with ${next.hotelName} check-in`
        });
      }
      
      // Check for gaps (more than 1 day)
      const gapDays = Math.ceil((nextCheckIn.getTime() - currentCheckOut.getTime()) / (1000 * 60 * 60 * 24));
      if (gapDays > 1) {
        newConflicts.push({
          type: 'gap',
          items: [current.id, next.id],
          message: `${gapDays} day gap between ${current.hotelName} and ${next.hotelName}`
        });
      }
    }

    setConflicts(newConflicts);
  };

  useEffect(() => {
    checkConflicts();
  }, [itineraryItems]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = itineraryItems.findIndex(item => item.id === draggedItem);
    const targetIndex = itineraryItems.findIndex(item => item.id === targetId);

    const newItems = [...itineraryItems];
    const [draggedItemObj] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItemObj);

    setItineraryItems(newItems);
    setDraggedItem(null);
  };

  const removeItem = (itemId: string) => {
    setItineraryItems(items => items.filter(item => item.id !== itemId));
  };

  const updateItemDates = (itemId: string, checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    setItineraryItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, checkIn, checkOut, nights }
          : item
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalDuration = calculateTotalDuration();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Itinerary Timeline</h1>
            <p className="text-gray-600">Drag and drop to reorder your travel schedule</p>
          </div>
          <button
            onClick={() => {/* TODO: Implement add hotel modal */}}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Hotel
          </button>
        </div>

        {/* Trip Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Total Duration</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{totalDuration.days} days</div>
            <div className="text-sm text-blue-700">{totalDuration.nights} nights</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Destinations</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{itineraryItems.length}</div>
            <div className="text-sm text-green-700">hotels booked</div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-900">Conflicts</span>
            </div>
            <div className="text-2xl font-bold text-amber-900">{conflicts.length}</div>
            <div className="text-sm text-amber-700">issues found</div>
          </div>
        </div>

        {/* Conflicts Alert */}
        {conflicts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-900">Scheduling Conflicts</span>
            </div>
            <div className="space-y-2">
              {conflicts.map((conflict, index) => (
                <div key={index} className="text-sm text-red-700">
                  • {conflict.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Travel Timeline</h2>
          
          {itineraryItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No hotels in your itinerary yet</p>
              <p className="text-sm">Click "Add Hotel" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {itineraryItems
                .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                .map((item, index) => (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-lg p-4 cursor-move transition-all ${
                      draggedItem === item.id ? 'opacity-50 rotate-2' : ''
                    } ${conflicts.some(c => c.items.includes(item.id)) ? 'border-red-300' : 'border-gray-200'}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                        <span className="font-medium text-gray-500">#{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.hotelName}</h3>
                            <p className="text-sm text-gray-600">{item.location}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Check-in</label>
                            <input
                              type="date"
                              value={item.checkIn}
                              onChange={(e) => updateItemDates(item.id, e.target.value, item.checkOut)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Check-out</label>
                            <input
                              type="date"
                              value={item.checkOut}
                              onChange={(e) => updateItemDates(item.id, item.checkIn, e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Nights</label>
                            <div className="text-sm font-medium text-gray-900 py-1">{item.nights}</div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Rate/Night</label>
                            <div className="text-sm font-medium text-gray-900 py-1">${item.rate}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Visual Timeline */}
        {itineraryItems.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Visual Timeline</h2>
            <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                {itineraryItems
                  .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                  .map((item, index) => (
                    <React.Fragment key={item.id}>
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${item.color} mb-2`}></div>
                        <div className="text-center">
                          <div className="font-medium text-sm text-gray-900">{item.hotelName}</div>
                          <div className="text-xs text-gray-600">{formatDate(item.checkIn)}</div>
                          <div className="text-xs text-gray-600">to {formatDate(item.checkOut)}</div>
                          <div className="text-xs font-medium text-gray-700">{item.nights} nights</div>
                        </div>
                      </div>
                      {index < itineraryItems.length - 1 && (
                        <div className="flex-1 h-0.5 bg-gray-300 min-w-[50px]"></div>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryTimeline;