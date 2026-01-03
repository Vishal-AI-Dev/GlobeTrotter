import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CitySearch = () => {
    const [query, setQuery] = useState('');
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Debounce search or just search on simple effect
    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            try {
                // Fetch from the backend search endpoint
                const response = await fetch(`http://127.0.0.1:8000/search/cities?q=${query}`);
                if (response.ok) {
                    const data = await response.json();
                    setCities(data);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchCities();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <Navbar />

            <main className="p-8 max-w-[1200px] mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black uppercase italic text-[#102C57] tracking-tighter mb-4">
                        Discover Your Next Stop
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-8">
                        Explore popular destinations based on cost and popularity
                    </p>

                    {/* SEARCH INPUT */}
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search by city or country..."
                            className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-[#102C57] focus:outline-none focus:border-[#102C57] transition-colors shadow-lg"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">🌍</span>
                    </div>
                </div>

                {/* RESULTS GRID */}
                {loading ? (
                    <div className="text-center text-slate-400 font-bold">Searching...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cities.length > 0 ? (
                            cities.map((city, index) => (
                                <div key={index} className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 relative">
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={city.image}
                                            alt={city.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#102C57]">
                                            {city.country}
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">
                                                {city.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${city.cost_index === 'High' || city.cost_index === 'Very High' ? 'bg-red-50 text-red-600' :
                                                    city.cost_index === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                                                }`}>
                                                {city.cost_index} Cost
                                            </span>
                                            <button
                                                className="bg-[#102C57] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-900 transition-colors"
                                                onClick={() => navigate('/create-trip')} // For now redirect to creating a tour, or could add to existing context
                                            >
                                                + Plan Trip
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-slate-400 font-bold">No cities found matching "{query}".</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CitySearch;
