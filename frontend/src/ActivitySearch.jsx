import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ActivitySearch = () => {
    const [searchParams] = useSearchParams();
    const cityParam = searchParams.get('city') || '';

    const [cityQuery, setCityQuery] = useState(cityParam);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [selectedType, setSelectedType] = useState('All');

    const navigate = useNavigate();

    // Fetch on mount if city is present, or when search button clicked
    useEffect(() => {
        if (cityQuery) {
            handleSearch();
        }
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/search/activities?city=${cityQuery}`);
            if (response.ok) {
                const data = await response.json();
                setActivities(data);
            } else {
                setActivities([]);
            }
        } catch (error) {
            console.error("Error fetching activities:", error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredActivities = selectedType === 'All'
        ? activities
        : activities.filter(act => act.type === selectedType);

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <Navbar />

            <main className="p-8 max-w-[1200px] mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black uppercase italic text-[#102C57] tracking-tighter mb-4">
                        Find Things To Do
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-8">
                        Curated experiences for your trip
                    </p>

                    {/* SEARCH INPUT */}
                    <div className="max-w-xl mx-auto flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Enter city (e.g. Paris)..."
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-[#102C57] focus:outline-none focus:border-[#102C57] transition-colors shadow-lg"
                                value={cityQuery}
                                onChange={(e) => setCityQuery(e.target.value)}
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl">🏙️</span>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-[#102C57] text-white px-8 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-900 transition-colors shadow-lg"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="flex justify-center gap-4 mb-10">
                    {['All', 'Sightseeing', 'Food', 'Adventure'].map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${selectedType === type
                                ? 'bg-[#102C57] text-white shadow-lg scale-105'
                                : 'bg-white text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* RESULTS GRID */}
                {loading ? (
                    <div className="text-center text-slate-400 font-bold">Loading experiences...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((act, index) => (
                                <div key={index} className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 flex flex-col">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            // Fallback image if none provided
                                            src={act.image || "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80"}
                                            alt={act.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#102C57]">
                                            ${act.cost}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-black text-[#102C57] uppercase leading-tight line-clamp-2">
                                                {act.name}
                                            </h3>
                                        </div>
                                        <div className="mb-4">
                                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {act.type}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 line-clamp-3">
                                            {act.description || "No description available."}
                                        </p>

                                        <div className="mt-auto">
                                            <button
                                                onClick={() => {
                                                    alert(`Added ${act.name} to wishlist! Go to your Trip Itinerary to finalize details.`);
                                                }}
                                                className="w-full bg-[#102C57] text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-900 transition-colors"
                                            >
                                                Add to Wishlist +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            cityQuery && !loading && (
                                <div className="col-span-full text-center py-20 bg-white rounded-[30px] border border-dashed border-gray-200">
                                    <p className="text-slate-400 font-bold">No activities found for "{cityQuery}". Try "Paris", "Berlin", or "Bali".</p>
                                </div>
                            )
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ActivitySearch;
