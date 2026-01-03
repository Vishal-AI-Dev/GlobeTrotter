import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';
import CreateTrip from './CreateTrip';
import ItineraryView from './ItineraryView';
import CitySearch from './CitySearch';
import ActivitySearch from './ActivitySearch';
import BudgetView from './BudgetView';
import TripCalendar from './TripCalendar';
import SharedItineraryView from './SharedItineraryView';
import UserProfile from './UserProfile';
import AdminDashboard from './AdminDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/itinerary-view/:id" element={<ItineraryView />} />
        <Route path="/city-search" element={<CitySearch />} />
        <Route path="/activity-search" element={<ActivitySearch />} />
        <Route path="/budget" element={<BudgetView />} />
        <Route path="/calendar" element={<TripCalendar />} />
        <Route path="/shared-trip/:id" element={<SharedItineraryView />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
