# Q2 Travel Project - Claude Development Guide

This file contains important lessons learned, configurations, and troubleshooting steps for the Q2 Travel project to prevent common issues from recurring.

## 🚀 Development Server Configuration

### Correct Server Start Command
```bash
# Use this command to start the development server
npx vite --host 0.0.0.0 --port 3000

# Alternative background start
npx vite --host 0.0.0.0 --port 3000 &
```

### Issue Resolution
- **Problem**: `npm run dev` starts server but browser can't connect
- **Root Cause**: Default Vite configuration doesn't bind to all interfaces
- **Solution**: Always use `--host 0.0.0.0` flag to bind to all network interfaces
- **Port**: Use port 3000 (tested and working) instead of default 5173

### Server Health Check
```bash
# Quick health check
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Should return: 200
```

## 🎯 TypeScript Best Practices

### Interface Definitions
Always define proper interfaces for React components and state:

```typescript
// ✅ Good - Proper interface definitions
interface QuoteItem {
  name: string;
  location: string;
  rate: string | number;
  nights: number;
  quantity: number;
  guests: number;
}

interface Hotel {
  name: string;
  location: string;
  stars?: number;
  rate: string | number;
  isPreferred?: boolean;
  // ... other optional properties
}

// ✅ Good - Typed state
const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
```

### Common Pitfalls to Avoid

1. **Never[] Type Issue**
   ```typescript
   // ❌ Bad - Creates never[] type
   const [items, setItems] = useState([]);
   
   // ✅ Good - Proper typing
   const [items, setItems] = useState<QuoteItem[]>([]);
   ```

2. **Function Parameter Types**
   ```typescript
   // ❌ Bad - Implicit any
   const handleClick = (item) => { ... }
   
   // ✅ Good - Explicit typing
   const handleClick = (item: QuoteItem) => { ... }
   ```

3. **Map Function Types**
   ```typescript
   // ❌ Bad - Implicit any
   items.map((item, idx) => ...)
   
   // ✅ Good - Explicit typing
   items.map((item: QuoteItem, idx: number) => ...)
   ```

## 🧪 Testing Configuration

### Playwright Issues
- **Problem**: Playwright MCP returns "Not connected" errors
- **Status**: Environmental issue, not code-related
- **Workaround**: Use manual browser testing or alternative testing tools
- **Server Verification**: Always verify server is running with curl before testing

### Alternative Testing
```bash
# Manual verification that server is working
curl -I http://localhost:3000
# Should return HTTP/1.1 200 OK
```

## 📦 Code Quality Guidelines

### Import Management
```typescript
// ✅ Clean imports - remove unused
import { Search, Star, TrendingUp } from 'lucide-react';

// ❌ Avoid unused imports
import { Search, Calendar, Users, Star } from 'lucide-react'; // Calendar, Users unused
```

### State Management Patterns
```typescript
// ✅ Good - Proper state updates
const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
  setItems(items => 
    items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    )
  );
};
```

## 🔧 Project-Specific Commands

### Development Workflow
```bash
# 1. Install dependencies
npm install

# 2. Start development server (IMPORTANT: Use this exact command)
npx vite --host 0.0.0.0 --port 3000

# 3. Type checking (with skipLibCheck to avoid JSX issues)
npx tsc --noEmit --skipLibCheck

# 4. Build for production
npm run build
```

### Troubleshooting Steps

1. **Server Won't Start**
   - Kill existing processes: `pkill -f node`
   - Check port availability: `lsof -i :3000`
   - Use full command: `npx vite --host 0.0.0.0 --port 3000`

2. **TypeScript Errors**
   - Focus on interface definitions first
   - Add proper type annotations to function parameters
   - Use `skipLibCheck` flag for development

3. **Build Failures**
   - Check for unused imports
   - Verify all interfaces are properly defined
   - Ensure all state is properly typed

## 📁 Project Structure

```
src/
├── components/
│   ├── ContractIntelligenceHub.tsx  # Main contract search interface
│   └── ItineraryTimeline.tsx        # Drag-and-drop timeline view
├── App.tsx                          # Main app with navigation
├── main.tsx                         # React entry point
└── index.css                        # Global styles
```

## 🚨 Known Issues & Workarounds

1. **Legacy TypeScript Errors in ContractIntelligenceHub.tsx**
   - Status: Minor typing issues remain
   - Impact: Does not affect functionality
   - Priority: Low - app works correctly

2. **Playwright MCP Connection**
   - Status: Environmental issue
   - Workaround: Manual browser testing
   - Server verification: Use curl for health checks

## 🎨 Feature Implementation Status

### ✅ Completed Features
- Quote Builder with sliding panel
  - **NEW**: Properly inherits search form dates and guest count
  - **NEW**: Calculates correct nights from date range
  - **NEW**: Shows trip summary with dates and duration
- Itinerary Timeline with drag-and-drop
- **NEW**: Commission & Markup Calculator
  - Interactive pricing table with real-time calculations
  - Configurable commission rates and markup settings
  - Visual profit margin breakdown with charts
  - Support for multiple hotels with varying parameters
  - **Multi-currency support** (ZAR, USD, GBP, EUR) with currency switching
  - **South African localization** with proper ZAR formatting
  - **LATEST**: Real-time currency conversion with exchange rate API
    - Live exchange rate fetching from exchangerate-api.com
    - Offline fallback with localStorage caching
    - Visual status indicators (online/offline rates)
    - Time since last update display
    - Comprehensive settings panel for exchange rate configuration
    - Automatic rate updates with configurable frequency
    - Error handling with graceful fallback to cached rates
- Navigation system between features
- Conflict detection and visual indicators
- Responsive design

### 🔄 Next Features
- Client Booking History
- Real-time Availability Checker
- Mobile-responsive improvements

## 📋 Development Checklist

Before implementing new features:
- [ ] Server is running with correct command
- [ ] TypeScript interfaces are defined
- [ ] Function parameters are typed
- [ ] State is properly typed
- [ ] Imports are clean (no unused)
- [ ] Components have proper prop types

## 🔗 Useful Resources

- Vite Documentation: https://vitejs.dev/
- TypeScript React: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide React Icons: https://lucide.dev/

---

## 🔄 Current Development Status (2025-07-09)

### Recently Completed
- **Real-time Currency Conversion Implementation**: Full implementation with exchange rate API integration
- **Exchange Rate Management**: Comprehensive settings panel and offline fallback
- **Multi-currency Support**: ZAR, USD, GBP, EUR with proper formatting and conversion
- **Status Indicators**: Visual indicators for online/offline exchange rates with timestamps
- **Client Booking History Feature**: Complete implementation with enhanced functionality
- **Q2 Logo Integration**: Proper logo proportions and branding
- **Advanced Pagination**: 10 bookings per page with proper navigation
- **Dynamic Client Statistics**: Real-time calculated booking counts and totals
- **Enhanced Client Management**: Previous trips, communication shortcuts, trip suggestions

### Current State
- **Development Server**: Running on `http://localhost:3001` (port 3000 was in use)
- **All Features**: Fully functional and tested with Playwright
- **TypeScript Status**: Minor errors in ContractIntelligenceHub.tsx (non-blocking)
- **Testing Status**: All features tested and working correctly
- **Date Logic**: All booking statuses aligned with proper future/past dates

### Next Steps
1. Implement Real-time Availability Checker
2. Address remaining TypeScript errors (low priority)
3. Mobile-responsive improvements
4. Performance optimizations

### Key Implementation Details
- **Exchange Rate API**: Uses exchangerate-api.com with 1000 free requests/month
- **Offline Support**: Caches rates in localStorage with error handling
- **Update Frequency**: Configurable (default 60 minutes)
- **Currency Formatting**: Proper localization for each currency
- **Base Currency**: Configurable (default ZAR for South African market)
- **Client Management**: Dynamic statistics, pagination, communication tools
- **Q2 Branding**: Proper logo integration with correct proportions
- **Live Time Display**: Real-time SAST clock in header

### Critical Fixes Applied
- **Date Logic**: Fixed all confirmed/pending bookings to have future dates (2025+)
- **Booking Counts**: Implemented dynamic calculation from actual bookings
- **Sorting**: Recent bookings sorted by most recent booking date
- **Status Consistency**: All booking statuses now logically consistent with dates

---

**Last Updated**: 2025-07-09 22:10 UTC
**Claude Version**: Sonnet 4
**Project Phase**: Feature Development - Client Management Complete