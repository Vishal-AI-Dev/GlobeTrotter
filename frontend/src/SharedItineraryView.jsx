import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Kept for consistency, though public views might have simplified nav

const SharedItineraryView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/trips');
                if (response.ok) {
                    const trips = await response.json();
                    const foundTrip = trips.find(t => t.id === parseInt(id));
                    setTrip(foundTrip);
                }
            } catch (error) {
                console.error("Error fetching trip:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    }, [id]);

    const handleCopyTrip = () => {
        // In a real app, this would clone the trip to the current user's account
        alert("Trip copied to your drafts! (Simulated)");
        navigate('/dashboard');
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };

    if (loading) return <div className="p-10 text-center text-[#102C57]">Loading shared itinerary...</div>;
    if (!trip) return <div className="p-10 text-center text-red-500">Trip not found!</div>;

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-[#102C57] p-2 rounded-lg shadow-lg flex items-center justify-center">
                        <span className="text-white text-xl">✈️</span>
                    </div>
                    <h2 className="text-[#102C57] font-black italic tracking-tighter text-2xl uppercase">Globetrotter <span className="text-xs not-italic text-slate-400 font-bold ml-2">Shared View</span></h2>
                </div>
            </nav>

            <main className="p-8 max-w-[1000px] mx-auto">
                {/* HEADER */}
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden mb-12">
                    <div className="h-64 relative">
                        <img
                            src={trip.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"}
                            alt={trip.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#102C57] to-transparent flex flex-col justify-end p-8">
                            <h1 className="text-4xl font-black uppercase italic text-white tracking-tighter mb-2">
                                {trip.name}
                            </h1>
                            <p className="text-blue-200 font-bold tracking-widest text-xs uppercase">
                                {trip.start_date} — {trip.end_date} • {trip.days || 5} Days
                            </p>
                        </div>
                    </div>
                    <div className="p-8 flex justify-between items-center">
                        <p className="text-slate-500 font-bold max-w-lg">
                            {trip.description || "An amazing journey awaits."}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleShare}
                                className="bg-white border-2 border-slate-100 text-[#102C57] px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-colors"
                            >
                                Share 🔗
                            </button>
                            <button
                                onClick={handleCopyTrip}
                                className="bg-[#102C57] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-900 transition-colors shadow-lg"
                            >
                                Copy Trip 📋
                            </button>
                        </div>
                    </div>
                </div>

                {/* TIMELINE (Read Only) */}
                <div className="space-y-8 relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 z-0"></div>

                    {(trip.stops || []).length === 0 ? (
                        <div className="text-center py-10 pl-16">
                            <p className="text-slate-400 font-bold">No stops in this itinerary.</p>
                        </div>
                    ) : (
                        trip.stops.map((stop, index) => (
                            <div key={index} className="relative z-10 pl-20">
                                {/* Dot */}
                                <div className="absolute left-6 top-6 w-4 h-4 bg-[#102C57] rounded-full ring-4 ring-blue-100"></div>

                                <div className="bg-white rounded-[30px] p-8 shadow-sm border border-slate-100">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-black text-[#102C57] uppercase">{stop.city_name}</h3>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {stop.arrival_date} ➝ {stop.departure_date}
                                        </div>
                                    </div>

                                    {/* Activities List */}
                                    <div className="space-y-3">
                                        {stop.activities.map((act, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="bg-white p-2 rounded-lg text-lg">
                                                    {act.type === 'Food' ? '🍽️' : act.type === 'Adventure' ? '🪂' : '🏛️'}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-[#102C57] text-sm">{act.name}</h4>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                        {act.time}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default SharedItineraryView;
