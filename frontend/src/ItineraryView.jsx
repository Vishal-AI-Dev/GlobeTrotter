import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const ItineraryView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Modal State
    const [showStopModal, setShowStopModal] = useState(false);
    const [newStop, setNewStop] = useState({
        city_name: '',
        arrival_date: '',
        departure_date: '',
        activities: []
    });

    // Activity State within Modal
    const [activityInput, setActivityInput] = useState({ name: '', cost: '', type: 'Sightseeing', time: '10:00' });

    // Fetch trip details
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

    const handleAddStop = () => {
        if (!newStop.city_name || !newStop.arrival_date) {
            alert("Please fill in city and arrival date");
            return;
        }

        const updatedStops = [...(trip.stops || []), newStop];
        setTrip({ ...trip, stops: updatedStops });

        // Reset and close
        setNewStop({ city_name: '', arrival_date: '', departure_date: '', activities: [] });
        setActivityInput({ name: '', cost: '', type: 'Sightseeing', time: '10:00' });
        setShowStopModal(false);
    };

    const handleAddActivity = () => {
        if (!activityInput.name) return;
        setNewStop({
            ...newStop,
            activities: [...newStop.activities, activityInput]
        });
        setActivityInput({ name: '', cost: '', type: 'Sightseeing', time: '10:00' });
    };

    const handleSaveTrip = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/trips/${trip.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trip)
            });

            if (response.ok) {
                alert("Trip saved successfully!");
            } else {
                alert("Failed to save trip");
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error saving trip");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-[#102C57]">Loading itinerary...</div>;
    if (!trip) return <div className="p-10 text-center text-red-500">Trip not found!</div>;

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <Navbar />

            <main className="p-8 max-w-[1200px] mx-auto relative">
                {/* HEADER */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic text-[#102C57] tracking-tighter mb-2">
                            {trip.name}
                        </h1>
                        <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">
                            {trip.start_date} — {trip.end_date}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(`/shared-trip/${trip.id}`)}
                            className="bg-white text-[#102C57] border-2 border-slate-100 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-colors"
                        >
                            Share 🔗
                        </button>
                        <button
                            onClick={handleSaveTrip}
                            disabled={isSaving}
                            className="bg-[#102C57] text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-900 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* STOPS TIMELINE */}
                <div className="space-y-6 relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 z-0"></div>

                    {(trip.stops || []).map((stop, index) => (
                        <div key={index} className="relative z-10 pl-20">
                            {/* Dot */}
                            <div className="absolute left-6 top-6 w-4 h-4 bg-[#102C57] rounded-full ring-4 ring-blue-100"></div>

                            <div className="bg-white rounded-[30px] p-8 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-[#102C57] uppercase">{stop.city_name}</h3>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {stop.arrival_date} ➝ {stop.departure_date}
                                        </div>
                                    </div>
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
                                        {stop.activities.length} Activities
                                    </span>
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
                                                    {act.time} • ${act.cost}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* ADD STOP BUTTON */}
                    <div className="pl-20">
                        <button
                            onClick={() => setShowStopModal(true)}
                            className="w-full border-2 border-dashed border-[#102C57]/30 text-[#102C57] py-6 rounded-[30px] font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="text-xl">+</span> Add Destination
                        </button>
                    </div>
                </div>

                {/* ADD STOP MODAL */}
                {showStopModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[40px] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
                            <h2 className="text-2xl font-black text-[#102C57] uppercase italic mb-6">Add New Destination</h2>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">City Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Rome"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-[#102C57] focus:ring-2 focus:ring-[#102C57]"
                                        value={newStop.city_name}
                                        onChange={(e) => setNewStop({ ...newStop, city_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Arrival</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-[#102C57]"
                                        value={newStop.arrival_date}
                                        onChange={(e) => setNewStop({ ...newStop, arrival_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-1 block">Departure</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-bold text-[#102C57]"
                                        value={newStop.departure_date}
                                        onChange={(e) => setNewStop({ ...newStop, departure_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Activities Section in Modal */}
                            <div className="bg-blue-50/50 p-6 rounded-3xl mb-6 border border-blue-100">
                                <h3 className="text-sm font-black text-[#102C57] uppercase mb-4">Add Activities</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <input
                                        type="text" placeholder="Activity Name"
                                        className="flex-1 min-w-[200px] bg-white border-none rounded-lg px-3 py-2 text-xs font-bold"
                                        value={activityInput.name}
                                        onChange={(e) => setActivityInput({ ...activityInput, name: e.target.value })}
                                    />
                                    <select
                                        className="bg-white border-none rounded-lg px-3 py-2 text-xs font-bold"
                                        value={activityInput.type}
                                        onChange={(e) => setActivityInput({ ...activityInput, type: e.target.value })}
                                    >
                                        <option>Sightseeing</option>
                                        <option>Food</option>
                                        <option>Adventure</option>
                                    </select>
                                    <input
                                        type="number" placeholder="Cost ($)"
                                        className="w-20 bg-white border-none rounded-lg px-3 py-2 text-xs font-bold"
                                        value={activityInput.cost}
                                        onChange={(e) => setActivityInput({ ...activityInput, cost: e.target.value })}
                                    />
                                    <button
                                        onClick={handleAddActivity}
                                        className="bg-[#102C57] text-white px-4 py-2 rounded-lg font-black text-xs uppercase"
                                    >
                                        + Add
                                    </button>
                                </div>

                                {/* List of added activities in modal */}
                                {newStop.activities.length > 0 && (
                                    <div className="space-y-2">
                                        {newStop.activities.map((act, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white px-4 py-2 rounded-lg border border-slate-100">
                                                <span className="text-xs font-bold text-[#102C57]">{act.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">{act.type} • ${act.cost}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowStopModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                            <button
                                onClick={handleAddStop}
                                className="w-full bg-[#102C57] text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-900 transition-colors mt-4"
                            >
                                Add Stop
                            </button>

                            <button
                                onClick={() => navigate('/activity-search')}
                                className="w-full mt-4 text-[#102C57] bg-blue-50 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-100 transition-colors"
                            >
                                Need Ideas? Browse Activities 🔍
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ItineraryView;
