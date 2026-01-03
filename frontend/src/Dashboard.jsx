import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [trips, setTrips] = useState([]);

    React.useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/trips');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setTrips(data);
                    } else {
                        console.error("API returned non-array data:", data);
                        setTrips([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };
        fetchTrips();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            {/* NAVIGATION BAR */}
            <Navbar />

            <main className="p-8 max-w-[1400px] mx-auto">
                {/* BANNER IMAGE */}
                <div className="relative w-full h-[450px] rounded-[50px] overflow-hidden shadow-2xl mb-12 group">
                    <img
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80"
                        alt="Travel Banner"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102C57]/80 to-transparent flex flex-col justify-end p-12">
                        <p className="text-blue-300 text-xs font-black uppercase tracking-[0.4em] mb-3">Welcome Back, Traveler</p>
                        <h1 className="text-white text-6xl font-black uppercase italic tracking-tighter leading-none">
                            Your Next Adventure <br /> Starts Here.
                        </h1>
                    </div>
                </div>

                {/* --- SEARCH & CONTROLS SECTION --- */}
                <div className="flex flex-col lg:flex-row gap-6 items-end justify-between mb-12">
                    {/* Search Bar with Label and Icon */}
                    <div className="w-full lg:w-1/3">
                        <label className="text-[10px] font-black uppercase text-[#102C57] mb-2 ml-2 block tracking-widest">Search for...</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Find your destination..."
                                className="dashboard-control-input w-full pl-12"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Group, Filter, Sort Lined Up Horizontally */}
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 block tracking-widest">Group by</label>
                            <select className="dashboard-control-select min-w-[140px]">
                                <option>Recent</option>
                                <option>Region</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 block tracking-widest">Filter</label>
                            <button className="dashboard-control-select min-w-[140px] text-left">All Trips</button>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-2 block tracking-widest">Sort by</label>
                            <select className="dashboard-control-select min-w-[140px]">
                                <option>Date</option>
                                <option>Priority</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* MY TRIPS GRID */}
                <div className="mb-12">
                    <h3 className="text-[#102C57] font-black uppercase italic text-2xl mb-6 flex items-center gap-3">
                        My Trips <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full not-italic font-bold">{trips.length}</span>
                    </h3>

                    {trips.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-300">
                            <p className="text-gray-400 font-bold">No trips planned yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {trips.map((trip) => (
                                <div
                                    key={trip.id}
                                    onClick={() => navigate(`/itinerary-view/${trip.id}`)}
                                    className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer border border-gray-100"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={trip.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"}
                                            alt={trip.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#102C57]">
                                            ${trip.budget_limit}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-black text-[#102C57] uppercase leading-tight">{trip.name}</h4>
                                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg font-bold text-slate-500">{trip.days || 5} Days</span>
                                        </div>
                                        <p className="text-slate-400 text-xs font-bold leading-relaxed mb-4 line-clamp-2">
                                            {trip.description || "No description provided."}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                            <span>📅 {trip.start_date || 'Date'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PLAN A TRIP BUTTON */}
                <div className="flex justify-center mt-8 pb-20">
                    <button
                        onClick={() => navigate('/create-trip')}
                        className="group relative bg-[#102C57] text-white px-12 py-6 rounded-3xl font-black uppercase text-sm tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(16,44,87,0.4)] hover:bg-blue-900 transition-all hover:-translate-y-2 active:scale-95"
                    >
                        <span className="flex items-center gap-4">
                            Plan A New Trip <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                        </span>
                    </button>
                </div>
            </main>

            {/* PAGE DECORATION */}
            <div className="fixed bottom-10 right-10 opacity-10 pointer-events-none">
                <span className="text-[150px] select-none">✈️</span>
            </div>
        </div>
    );
};

export default Dashboard;
