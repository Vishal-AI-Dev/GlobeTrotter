import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import { isWithinInterval, parseISO, format } from 'date-fns';

const TripCalendar = () => {
    const [trips, setTrips] = useState([]);
    const [value, onChange] = useState(new Date());
    const [selectedTrip, setSelectedTrip] = useState(null);

    // Fetch trips on mount
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/trips');
                if (response.ok) {
                    const data = await response.json();
                    setTrips(data);
                }
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };
        fetchTrips();
    }, []);

    // Update selected trip details when date changes
    useEffect(() => {
        const found = trips.find(trip => {
            const start = parseISO(trip.start_date);
            const end = parseISO(trip.end_date);
            return isWithinInterval(value, { start, end });
        });
        setSelectedTrip(found || null);
    }, [value, trips]);

    // Function to highlight trip dates
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isTripDay = trips.some(trip => {
                const start = parseISO(trip.start_date);
                const end = parseISO(trip.end_date);
                return isWithinInterval(date, { start, end });
            });
            return isTripDay ? 'trip-day-highlight' : null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <Navbar />

            <main className="p-8 max-w-[1200px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* LEFT: CALENDAR */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-black uppercase italic text-[#102C57] tracking-tighter mb-2">
                            My Trip Timeline
                        </h1>
                        <p className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-8">
                            Visualize your adventures over time
                        </p>

                        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
                            {/* Custom Styles for Calendar Highlight */}
                            <style>{`
                                .react-calendar { 
                                    width: 100%; border: none; font-family: inherit; 
                                }
                                .trip-day-highlight {
                                    background: #102C57 !important;
                                    color: white !important;
                                    border-radius: 50%;
                                }
                                .react-calendar__tile--now {
                                    background: #eff6ff;
                                    border-radius: 50%;
                                }
                                .react-calendar__tile--active {
                                    background: #3b82f6 !important;
                                    color: white !important;
                                    border-radius: 50%;
                                }
                            `}</style>
                            <Calendar
                                onChange={onChange}
                                value={value}
                                tileClassName={tileClassName}
                            />
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="flex-1 mt-20">
                        {selectedTrip ? (
                            <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 animate-in slide-in-from-right duration-500">
                                <div className="h-48 relative">
                                    <img
                                        src={selectedTrip.image_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"}
                                        alt={selectedTrip.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#102C57] to-transparent flex items-end p-8">
                                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                                            {selectedTrip.name}
                                        </h2>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="bg-blue-50 p-4 rounded-2xl mb-6 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Selected Date</p>
                                            <p className="text-lg font-bold text-[#102C57]">{format(value, 'MMMM do, yyyy')}</p>
                                        </div>
                                        <span className="text-2xl">📅</span>
                                    </div>

                                    <p className="text-slate-500 text-sm font-bold mb-6">
                                        {selectedTrip.description}
                                    </p>

                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                        Planned Stops for this Trip:
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {(selectedTrip.stops || []).map((stop, i) => (
                                            <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
                                                {stop.city_name}
                                            </span>
                                        ))}
                                    </div>

                                    <button className="w-full bg-[#102C57] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-900 transition-colors">
                                        View Full Itinerary
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[40px] p-12 text-center border border-dashed border-slate-300">
                                <span className="text-6xl mb-4 block opacity-20">🏖️</span>
                                <h3 className="text-xl font-black text-[#102C57] uppercase italic mb-2">
                                    No Trip Planned
                                </h3>
                                <p className="text-slate-400 font-bold text-sm">
                                    You don't have any trips scheduled for <br />
                                    <span className="text-blue-500">{format(value, 'MMMM do, yyyy')}</span>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TripCalendar;
