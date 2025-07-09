import React, { useState } from 'react';
import { Search, User, Calendar, MapPin, Phone, Mail, Star, History, Filter, TrendingUp, ArrowRight, DollarSign, Users, ChevronLeft, ChevronRight, MessageCircle, Send, ExternalLink } from 'lucide-react';

interface BookingHistoryItem {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'completed' | 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
  preferences: string[];
  notes: string;
  repeatClient: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  preferences: string[];
  notes: string;
  rating: number;
}

const ClientBookingHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPreviousTrips, setShowPreviousTrips] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  // Mock data
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+27 82 123 4567',
      totalBookings: 4,
      totalSpent: 220000,
      lastBooking: '2024-12-15',
      preferences: ['Luxury Lodges', 'Big 5 Safari', 'Photography Tours'],
      notes: 'Prefers early morning game drives. Allergic to nuts.',
      rating: 5
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 555 987 6543',
      totalBookings: 2,
      totalSpent: 89000,
      lastBooking: '2024-10-10',
      preferences: ['Bush Walks', 'Cultural Experiences', 'Mid-range Accommodation'],
      notes: 'Interested in conservation efforts. Vegetarian meals.',
      rating: 4
    },
    {
      id: '3',
      name: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44 20 7946 0958',
      totalBookings: 6,
      totalSpent: 280000,
      lastBooking: '2024-02-28',
      preferences: ['Exclusive Camps', 'Wine Tasting', 'Spa Treatments'],
      notes: 'VIP client. Prefers private vehicles and guides.',
      rating: 5
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 212 555 0123',
      totalBookings: 3,
      totalSpent: 156000,
      lastBooking: '2024-06-10',
      preferences: ['Adventure Activities', 'Camping', 'Group Tours'],
      notes: 'Loves hiking and outdoor adventures. Travels with extended family.',
      rating: 4
    },
    {
      id: '5',
      name: 'Lisa Martinez',
      email: 'lisa.martinez@email.com',
      phone: '+34 91 123 4567',
      totalBookings: 2,
      totalSpent: 78000,
      lastBooking: '2024-04-22',
      preferences: ['Boutique Hotels', 'Cultural Tours', 'Local Cuisine'],
      notes: 'First-time safari visitor. Interested in local culture.',
      rating: 5
    },
    {
      id: '6',
      name: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '+44 161 496 0011',
      totalBookings: 5,
      totalSpent: 340000,
      lastBooking: '2024-07-05',
      preferences: ['Luxury Safari', 'Private Guides', 'Helicopter Tours'],
      notes: 'High-end client. Prefers helicopter transfers and exclusive experiences.',
      rating: 5
    },
    {
      id: '7',
      name: 'Jennifer Lee',
      email: 'jennifer.lee@email.com',
      phone: '+1 415 555 0199',
      totalBookings: 1,
      totalSpent: 45000,
      lastBooking: '2024-05-15',
      preferences: ['Wildlife Photography', 'Early Game Drives', 'Quiet Lodges'],
      notes: 'Professional photographer. Needs early morning access.',
      rating: 4
    },
    {
      id: '8',
      name: 'Marco Rossi',
      email: 'marco.rossi@email.com',
      phone: '+39 02 1234 5678',
      totalBookings: 3,
      totalSpent: 195000,
      lastBooking: '2024-06-28',
      preferences: ['Family-Friendly', 'Educational Tours', 'Swimming Pools'],
      notes: 'Travels with young children. Needs family-friendly accommodations.',
      rating: 5
    },
    {
      id: '9',
      name: 'Sophie Brown',
      email: 'sophie.brown@email.com',
      phone: '+61 2 9876 5432',
      totalBookings: 2,
      totalSpent: 98000,
      lastBooking: '2024-03-08',
      preferences: ['Eco-Tourism', 'Conservation', 'Sustainable Travel'],
      notes: 'Environmentally conscious. Prefers eco-friendly lodges.',
      rating: 4
    },
    {
      id: '10',
      name: 'James Anderson',
      email: 'james.anderson@email.com',
      phone: '+1 303 555 0156',
      totalBookings: 4,
      totalSpent: 220000,
      lastBooking: '2024-05-30',
      preferences: ['Big 5 Safari', 'Walking Safaris', 'Stargazing'],
      notes: 'Astronomy enthusiast. Requests dark sky locations.',
      rating: 5
    },
    {
      id: '11',
      name: 'Anna Mueller',
      email: 'anna.mueller@email.com',
      phone: '+49 30 12345678',
      totalBookings: 1,
      totalSpent: 52000,
      lastBooking: '2024-07-02',
      preferences: ['Luxury Tented Camps', 'Wine Pairing', 'Wellness'],
      notes: 'New client. Interested in wellness and luxury experiences.',
      rating: 4
    },
    {
      id: '12',
      name: 'Carlos Silva',
      email: 'carlos.silva@email.com',
      phone: '+55 11 98765 4321',
      totalBookings: 2,
      totalSpent: 134000,
      lastBooking: '2024-04-18',
      preferences: ['Bird Watching', 'Nature Walks', 'Photography'],
      notes: 'Ornithologist. Requests specialized bird watching guides.',
      rating: 5
    }
  ];

  const mockBookings: BookingHistoryItem[] = [
    // Sarah Johnson - 4 bookings
    {
      id: '1',
      clientName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+27 82 123 4567',
      destination: 'Sabi Sands Game Reserve',
      checkIn: '2024-03-15',
      checkOut: '2024-03-18',
      guests: 2,
      totalAmount: 45000,
      status: 'completed',
      bookingDate: '2024-02-10',
      preferences: ['Luxury Lodges', 'Big 5 Safari'],
      notes: 'Special anniversary trip',
      repeatClient: true
    },
    {
      id: '2',
      clientName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+27 82 123 4567',
      destination: 'Kruger National Park',
      checkIn: '2024-08-12',
      checkOut: '2024-08-17',
      guests: 2,
      totalAmount: 38000,
      status: 'completed',
      bookingDate: '2024-07-01',
      preferences: ['Luxury Lodges', 'Photography Tours'],
      notes: 'Follow-up safari experience',
      repeatClient: true
    },
    {
      id: '3',
      clientName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+27 82 123 4567',
      destination: 'Madikwe Game Reserve',
      checkIn: '2023-11-05',
      checkOut: '2023-11-08',
      guests: 2,
      totalAmount: 42000,
      status: 'completed',
      bookingDate: '2023-09-20',
      preferences: ['Luxury Lodges', 'Big 5 Safari'],
      notes: 'First safari experience - loved it!',
      repeatClient: false
    },
    {
      id: '4',
      clientName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+27 82 123 4567',
      destination: 'Timbavati Private Reserve',
      checkIn: '2025-12-15',
      checkOut: '2025-12-20',
      guests: 4,
      totalAmount: 95000,
      status: 'confirmed',
      bookingDate: '2025-07-05',
      preferences: ['Luxury Lodges', 'Photography Tours'],
      notes: 'Christmas holiday with family',
      repeatClient: true
    },
    // Michael Chen - 2 bookings
    {
      id: '5',
      clientName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 555 987 6543',
      destination: 'Kruger National Park',
      checkIn: '2024-01-20',
      checkOut: '2024-01-25',
      guests: 4,
      totalAmount: 32000,
      status: 'completed',
      bookingDate: '2023-12-15',
      preferences: ['Bush Walks', 'Cultural Experiences'],
      notes: 'Family vacation with teenagers',
      repeatClient: false
    },
    {
      id: '6',
      clientName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 555 987 6543',
      destination: 'Hluhluwe-iMfolozi Park',
      checkIn: '2025-10-10',
      checkOut: '2025-10-14',
      guests: 4,
      totalAmount: 57000,
      status: 'confirmed',
      bookingDate: '2025-06-15',
      preferences: ['Cultural Experiences', 'Mid-range Accommodation'],
      notes: 'Rhino conservation focus trip',
      repeatClient: true
    },
    // Emma Thompson - 6 bookings
    {
      id: '7',
      clientName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44 20 7946 0958',
      destination: 'Thornybush Game Reserve',
      checkIn: '2024-02-28',
      checkOut: '2024-03-05',
      guests: 2,
      totalAmount: 78000,
      status: 'completed',
      bookingDate: '2024-01-10',
      preferences: ['Exclusive Camps', 'Wine Tasting'],
      notes: 'Corporate incentive trip',
      repeatClient: true
    },
    {
      id: '8',
      clientName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44 20 7946 0958',
      destination: 'Sabi Sands Game Reserve',
      checkIn: '2023-09-14',
      checkOut: '2023-09-18',
      guests: 2,
      totalAmount: 85000,
      status: 'completed',
      bookingDate: '2023-07-05',
      preferences: ['Exclusive Camps', 'Spa Treatments'],
      notes: 'Luxury wellness retreat',
      repeatClient: true
    },
    {
      id: '9',
      clientName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44 20 7946 0958',
      destination: 'Kapama Private Game Reserve',
      checkIn: '2025-10-05',
      checkOut: '2025-10-10',
      guests: 6,
      totalAmount: 117000,
      status: 'confirmed',
      bookingDate: '2025-07-08',
      preferences: ['Exclusive Camps', 'Wine Tasting'],
      notes: 'Team building event for executives',
      repeatClient: true
    },
    {
      id: '10',
      clientName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44 20 7946 0958',
      destination: 'Madikwe Game Reserve',
      checkIn: '2023-05-20',
      checkOut: '2023-05-25',
      guests: 2,
      totalAmount: 72000,
      status: 'completed',
      bookingDate: '2023-03-10',
      preferences: ['Exclusive Camps', 'Wine Tasting'],
      notes: 'Perfect service as always',
      repeatClient: true
    },
    {
      id: '11',
      clientName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44 20 7946 0958',
      destination: 'Timbavati Private Reserve',
      checkIn: '2023-01-15',
      checkOut: '2023-01-20',
      guests: 2,
      totalAmount: 68000,
      status: 'completed',
      bookingDate: '2022-11-20',
      preferences: ['Exclusive Camps', 'Spa Treatments'],
      notes: 'New Year celebration trip',
      repeatClient: true
    },
    {
      id: '12',
      clientName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44 20 7946 0958',
      destination: 'Phinda Private Game Reserve',
      checkIn: '2025-11-20',
      checkOut: '2025-11-25',
      guests: 2,
      totalAmount: 92000,
      status: 'pending',
      bookingDate: '2025-07-09',
      preferences: ['Exclusive Camps', 'Wine Tasting'],
      notes: 'Booking for Thanksgiving week',
      repeatClient: true
    },
    // David Wilson - 3 bookings
    {
      id: '13',
      clientName: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 212 555 0123',
      destination: 'Kruger National Park',
      checkIn: '2024-06-10',
      checkOut: '2024-06-16',
      guests: 8,
      totalAmount: 64000,
      status: 'completed',
      bookingDate: '2024-04-15',
      preferences: ['Adventure Activities', 'Group Tours'],
      notes: 'Extended family reunion safari',
      repeatClient: true
    },
    {
      id: '14',
      clientName: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 212 555 0123',
      destination: 'Hluhluwe-iMfolozi Park',
      checkIn: '2023-12-20',
      checkOut: '2023-12-27',
      guests: 6,
      totalAmount: 42000,
      status: 'completed',
      bookingDate: '2023-10-05',
      preferences: ['Adventure Activities', 'Camping'],
      notes: 'Christmas holiday adventure',
      repeatClient: false
    },
    {
      id: '15',
      clientName: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 212 555 0123',
      destination: 'Addo Elephant National Park',
      checkIn: '2025-09-22',
      checkOut: '2025-09-28',
      guests: 10,
      totalAmount: 50000,
      status: 'confirmed',
      bookingDate: '2025-07-02',
      preferences: ['Adventure Activities', 'Group Tours'],
      notes: 'Large group booking - corporate retreat',
      repeatClient: true
    },
    // Lisa Martinez - 2 bookings
    {
      id: '16',
      clientName: 'Lisa Martinez',
      email: 'lisa.martinez@email.com',
      phone: '+34 91 123 4567',
      destination: 'Thornybush Game Reserve',
      checkIn: '2024-04-22',
      checkOut: '2024-04-26',
      guests: 2,
      totalAmount: 48000,
      status: 'completed',
      bookingDate: '2024-02-14',
      preferences: ['Boutique Hotels', 'Cultural Tours'],
      notes: 'First safari - exceeded expectations!',
      repeatClient: false
    },
    {
      id: '17',
      clientName: 'Lisa Martinez',
      email: 'lisa.martinez@email.com',
      phone: '+34 91 123 4567',
      destination: 'Kapama Private Game Reserve',
      checkIn: '2025-11-08',
      checkOut: '2025-11-12',
      guests: 2,
      totalAmount: 30000,
      status: 'pending',
      bookingDate: '2025-07-08',
      preferences: ['Boutique Hotels', 'Local Cuisine'],
      notes: 'Return trip - wants to try different region',
      repeatClient: true
    },
    // Robert Taylor - 5 bookings
    {
      id: '18',
      clientName: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '+44 161 496 0011',
      destination: 'Sabi Sands Game Reserve',
      checkIn: '2024-07-05',
      checkOut: '2024-07-10',
      guests: 2,
      totalAmount: 125000,
      status: 'completed',
      bookingDate: '2024-05-10',
      preferences: ['Luxury Safari', 'Private Guides'],
      notes: 'Helicopter transfers arranged',
      repeatClient: true
    },
    {
      id: '19',
      clientName: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '+44 161 496 0011',
      destination: 'Timbavati Private Reserve',
      checkIn: '2024-03-18',
      checkOut: '2024-03-23',
      guests: 4,
      totalAmount: 95000,
      status: 'completed',
      bookingDate: '2024-01-15',
      preferences: ['Luxury Safari', 'Helicopter Tours'],
      notes: 'VIP treatment for business associates',
      repeatClient: true
    },
    {
      id: '20',
      clientName: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '+44 161 496 0011',
      destination: 'Phinda Private Game Reserve',
      checkIn: '2023-11-12',
      checkOut: '2023-11-17',
      guests: 2,
      totalAmount: 78000,
      status: 'completed',
      bookingDate: '2023-09-05',
      preferences: ['Luxury Safari', 'Private Guides'],
      notes: 'Excellent service as always',
      repeatClient: true
    },
    {
      id: '21',
      clientName: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '+44 161 496 0011',
      destination: 'Madikwe Game Reserve',
      checkIn: '2023-06-25',
      checkOut: '2023-06-30',
      guests: 2,
      totalAmount: 42000,
      status: 'completed',
      bookingDate: '2023-04-10',
      preferences: ['Luxury Safari', 'Private Guides'],
      notes: 'First booking - great introduction to safari',
      repeatClient: false
    },
    {
      id: '22',
      clientName: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '+44 161 496 0011',
      destination: 'Kapama Private Game Reserve',
      checkIn: '2025-12-22',
      checkOut: '2025-12-28',
      guests: 6,
      totalAmount: 180000,
      status: 'pending',
      bookingDate: '2025-07-09',
      preferences: ['Luxury Safari', 'Helicopter Tours'],
      notes: 'Christmas celebration with family',
      repeatClient: true
    },
    // Jennifer Lee - 1 booking
    {
      id: '23',
      clientName: 'Jennifer Lee',
      email: 'jennifer.lee@email.com',
      phone: '+1 415 555 0199',
      destination: 'Kruger National Park',
      checkIn: '2024-05-15',
      checkOut: '2024-05-20',
      guests: 1,
      totalAmount: 45000,
      status: 'completed',
      bookingDate: '2024-03-20',
      preferences: ['Wildlife Photography', 'Early Game Drives'],
      notes: 'Professional photographer assignment',
      repeatClient: false
    },
    // Marco Rossi - 3 bookings
    {
      id: '24',
      clientName: 'Marco Rossi',
      email: 'marco.rossi@email.com',
      phone: '+39 02 1234 5678',
      destination: 'Thornybush Game Reserve',
      checkIn: '2024-06-28',
      checkOut: '2024-07-03',
      guests: 4,
      totalAmount: 68000,
      status: 'completed',
      bookingDate: '2024-04-15',
      preferences: ['Family-Friendly', 'Swimming Pools'],
      notes: 'Summer holiday with kids',
      repeatClient: true
    },
    {
      id: '25',
      clientName: 'Marco Rossi',
      email: 'marco.rossi@email.com',
      phone: '+39 02 1234 5678',
      destination: 'Kapama Private Game Reserve',
      checkIn: '2023-08-14',
      checkOut: '2023-08-19',
      guests: 4,
      totalAmount: 62000,
      status: 'completed',
      bookingDate: '2023-06-10',
      preferences: ['Family-Friendly', 'Educational Tours'],
      notes: 'First family safari - kids loved it!',
      repeatClient: false
    },
    {
      id: '26',
      clientName: 'Marco Rossi',
      email: 'marco.rossi@email.com',
      phone: '+39 02 1234 5678',
      destination: 'Addo Elephant National Park',
      checkIn: '2025-08-25',
      checkOut: '2025-08-30',
      guests: 4,
      totalAmount: 65000,
      status: 'confirmed',
      bookingDate: '2025-06-20',
      preferences: ['Family-Friendly', 'Educational Tours'],
      notes: 'Educational focus on elephants for children',
      repeatClient: true
    },
    // Sophie Brown - 2 bookings
    {
      id: '27',
      clientName: 'Sophie Brown',
      email: 'sophie.brown@email.com',
      phone: '+61 2 9876 5432',
      destination: 'Hluhluwe-iMfolozi Park',
      checkIn: '2024-03-08',
      checkOut: '2024-03-13',
      guests: 2,
      totalAmount: 38000,
      status: 'completed',
      bookingDate: '2024-01-15',
      preferences: ['Eco-Tourism', 'Conservation'],
      notes: 'Rhino conservation volunteer program',
      repeatClient: false
    },
    {
      id: '28',
      clientName: 'Sophie Brown',
      email: 'sophie.brown@email.com',
      phone: '+61 2 9876 5432',
      destination: 'Phinda Private Game Reserve',
      checkIn: '2025-10-15',
      checkOut: '2025-10-20',
      guests: 2,
      totalAmount: 60000,
      status: 'confirmed',
      bookingDate: '2025-07-05',
      preferences: ['Eco-Tourism', 'Sustainable Travel'],
      notes: 'Eco-lodge focus for sustainable tourism',
      repeatClient: true
    },
    // James Anderson - 4 bookings
    {
      id: '29',
      clientName: 'James Anderson',
      email: 'james.anderson@email.com',
      phone: '+1 303 555 0156',
      destination: 'Madikwe Game Reserve',
      checkIn: '2024-05-30',
      checkOut: '2024-06-04',
      guests: 2,
      totalAmount: 55000,
      status: 'completed',
      bookingDate: '2024-03-25',
      preferences: ['Big 5 Safari', 'Stargazing'],
      notes: 'Dark sky location perfect for astronomy',
      repeatClient: true
    },
    {
      id: '30',
      clientName: 'James Anderson',
      email: 'james.anderson@email.com',
      phone: '+1 303 555 0156',
      destination: 'Timbavati Private Reserve',
      checkIn: '2025-11-05',
      checkOut: '2025-11-10',
      guests: 2,
      totalAmount: 65000,
      status: 'confirmed',
      bookingDate: '2025-07-01',
      preferences: ['Walking Safaris', 'Stargazing'],
      notes: 'Combination of walking safaris and night sky observation',
      repeatClient: true
    },
    // Additional bookings with various statuses
    {
      id: '31',
      clientName: 'Anna Mueller',
      email: 'anna.mueller@email.com',
      phone: '+49 30 12345678',
      destination: 'Sabi Sands Game Reserve',
      checkIn: '2025-12-05',
      checkOut: '2025-12-10',
      guests: 2,
      totalAmount: 85000,
      status: 'pending',
      bookingDate: '2025-07-09',
      preferences: ['Luxury Tented Camps', 'Wellness'],
      notes: 'Pending payment confirmation',
      repeatClient: true
    },
    {
      id: '32',
      clientName: 'Carlos Silva',
      email: 'carlos.silva@email.com',
      phone: '+55 11 98765 4321',
      destination: 'Kruger National Park',
      checkIn: '2025-09-15',
      checkOut: '2025-09-20',
      guests: 2,
      totalAmount: 48000,
      status: 'cancelled',
      bookingDate: '2025-06-20',
      preferences: ['Bird Watching', 'Photography'],
      notes: 'Cancelled due to work commitments',
      repeatClient: true
    },
    {
      id: '33',
      clientName: 'Jennifer Lee',
      email: 'jennifer.lee@email.com',
      phone: '+1 415 555 0199',
      destination: 'Thornybush Game Reserve',
      checkIn: '2024-01-15',
      checkOut: '2024-01-20',
      guests: 1,
      totalAmount: 52000,
      status: 'cancelled',
      bookingDate: '2023-11-20',
      preferences: ['Wildlife Photography', 'Quiet Lodges'],
      notes: 'Cancelled due to equipment issues',
      repeatClient: true
    },
    {
      id: '34',
      clientName: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 212 555 0123',
      destination: 'Phinda Private Game Reserve',
      checkIn: '2025-08-15',
      checkOut: '2025-08-20',
      guests: 6,
      totalAmount: 78000,
      status: 'pending',
      bookingDate: '2025-07-08',
      preferences: ['Adventure Activities', 'Group Tours'],
      notes: 'Waiting for group confirmation',
      repeatClient: true
    }
  ];

  // Calculate dynamic client stats from bookings
  const getClientStats = (clientName: string) => {
    const clientBookings = mockBookings.filter(booking => booking.clientName === clientName);
    const totalBookings = clientBookings.length;
    const totalSpent = clientBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const lastBooking = clientBookings.length > 0 
      ? clientBookings.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())[0].checkIn
      : null;
    return { totalBookings, totalSpent, lastBooking };
  };

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Sort by most recent booking date (bookingDate field)
    return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + bookingsPerPage);

  const getClientBookings = (clientName: string) => {
    return mockBookings.filter(booking => booking.clientName === clientName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const suggestSimilarTrips = (client: Client) => {
    // Mock similar trip suggestions based on client preferences
    const suggestions = [
      {
        destination: 'Madikwe Game Reserve',
        reason: 'Similar luxury safari experience',
        estimatedCost: 52000
      },
      {
        destination: 'Pilanesberg National Park',
        reason: 'Based on Big 5 preference',
        estimatedCost: 38000
      },
      {
        destination: 'Timbavati Private Reserve',
        reason: 'Exclusive photographic opportunities',
        estimatedCost: 65000
      }
    ];
    return suggestions;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Booking History</h1>
          <p className="text-gray-600 mt-2">Manage repeat clients and track booking patterns</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{mockClients.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Repeat Rate</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients, destinations, or bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Clients</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredClients.map((client) => {
                const stats = getClientStats(client.name);
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedClient?.id === client.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{stats.totalBookings} bookings</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{formatCurrency(stats.totalSpent)}</span>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < client.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {selectedClient ? (
            <>
              {/* Client Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedClient.name}</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowPreviousTrips(!showPreviousTrips)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <History className="h-4 w-4" />
                      <span>Previous Trips</span>
                    </button>
                    <button
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Suggest Similar</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedClient.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <History className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Last booking: {getClientStats(selectedClient.name).lastBooking || 'No bookings'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Total spent: {formatCurrency(getClientStats(selectedClient.name).totalSpent)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.preferences.map((pref, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                    <p className="text-sm text-gray-600">{selectedClient.notes}</p>
                  </div>
                </div>

                {/* Social Media & Communication */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Quick Communication</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </button>
                    <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors">
                      <Send className="h-4 w-4" />
                      <span>Send Newsletter</span>
                    </button>
                    <button className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      <span>Latest News</span>
                    </button>
                    <button className="bg-orange-50 text-orange-700 hover:bg-orange-100 px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors">
                      <Calendar className="h-4 w-4" />
                      <span>Special Offers</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Previous Trips */}
              {showPreviousTrips && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Trips</h3>
                  <div className="space-y-3">
                    {getClientBookings(selectedClient.name).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{booking.destination}</h4>
                              <p className="text-sm text-gray-600">{booking.checkIn} - {booking.checkOut}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{booking.notes}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{formatCurrency(booking.totalAmount)}</span>
                          <button className="text-blue-600 hover:text-blue-800">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trip Suggestions */}
              {showSuggestions && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Similar Trips</h3>
                  <div className="space-y-3">
                    {suggestSimilarTrips(selectedClient).map((suggestion, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{suggestion.destination}</h4>
                          <p className="text-sm text-gray-600">{suggestion.reason}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{formatCurrency(suggestion.estimatedCost)}</span>
                          <button className="text-blue-600 hover:text-blue-800">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recent Bookings */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                  <span className="text-sm text-gray-500">
                    Showing {startIndex + 1}-{Math.min(startIndex + bookingsPerPage, filteredBookings.length)} of {filteredBookings.length}
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {paginatedBookings.map((booking) => (
                    <div key={booking.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{booking.clientName}</h3>
                            <p className="text-sm text-gray-600">{booking.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          {booking.repeatClient && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                              Repeat Client
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.checkIn} - {booking.checkOut}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatCurrency(booking.totalAmount)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded text-sm ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientBookingHistory;