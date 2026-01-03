import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const BudgetView = () => {
    const { id } = useParams(); // Optional: if we want to deep link
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState(id || '');
    const [stats, setStats] = useState(null);

    // COLORS for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/trips');
                if (response.ok) {
                    const data = await response.json();
                    setTrips(data);
                    // Default to first trip if none selected
                    if (!selectedTripId && data.length > 0) {
                        setSelectedTripId(data[0].id);
                    }
                }
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };
        fetchTrips();
    }, []);

    // Calculate stats whenever selectedTripId changes
    useEffect(() => {
        if (!selectedTripId || trips.length === 0) return;

        const trip = trips.find(t => t.id === parseInt(selectedTripId));
        if (!trip) return;

        // 1. Calculate Activity Costs (Real)
        let activityCost = 0;
        trip.stops.forEach(stop => {
            stop.activities.forEach(act => {
                activityCost += act.cost;
            });
        });

        // 2. Estimate Other Costs (Derived from Real Trip Data)
        // Assume Flights = $500 base + $100 per stop (Simulating travel distance)
        const transportCost = 500 + (trip.stops.length * 100);

        // Calculate Duration from Real Dates
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        const differenceInTime = end.getTime() - start.getTime();
        const differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
        const duration = differenceInDays > 0 ? differenceInDays : 5; // Default to 5 if dates invalid

        // Assume Stay = $150 per night * real duration
        const stayCost = duration * 150;

        // Food = $50 per day * real duration
        const mealsCost = duration * 50;

        const totalCost = activityCost + transportCost + stayCost + mealsCost;
        const budget = trip.budget_limit;

        setStats({
            tripName: trip.name,
            totalCost,
            budget,
            remaining: budget - totalCost,
            breakdown: [
                { name: 'Flights & Transport', value: transportCost },
                { name: 'Accommodation', value: stayCost },
                { name: 'Activities', value: activityCost },
                { name: 'Food & Dining', value: mealsCost },
            ]
        });

    }, [selectedTripId, trips]);

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <Navbar />

            <main className="p-8 max-w-[1200px] mx-auto">
                {/* HEADER & SELECTOR */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic text-[#102C57] tracking-tighter mb-2">
                            Budget Analytics
                        </h1>
                        <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">
                            Track your spending and estimates
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Select Trip</label>
                        <select
                            className="w-full md:min-w-[300px] bg-white border-2 border-slate-200 rounded-xl px-4 py-2 font-bold text-[#102C57]"
                            value={selectedTripId}
                            onChange={(e) => setSelectedTripId(e.target.value)}
                        >
                            {trips.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {stats ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT: SUMMARY CARDS */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Estimated Cost</h3>
                                <p className="text-4xl font-black text-[#102C57]">${stats.totalCost.toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Budget Limit</h3>
                                <p className="text-4xl font-black text-slate-400">${stats.budget.toLocaleString()}</p>
                            </div>
                            <div className={`p-6 rounded-[30px] shadow-sm border ${stats.remaining < 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                <h3 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${stats.remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {stats.remaining < 0 ? 'Over Budget By' : 'Remaining Budget'}
                                </h3>
                                <p className={`text-4xl font-black ${stats.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ${Math.abs(stats.remaining).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* MIDDLE: PIE CHART */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-[30px] shadow-lg border border-slate-100">
                            <h3 className="text-[#102C57] font-black uppercase italic text-xl mb-6">Cost Breakdown</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.breakdown}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {stats.breakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* RIGHT: BAR CHART comparison */}
                        <div className="bg-white p-8 rounded-[30px] shadow-lg border border-slate-100">
                            <h3 className="text-[#102C57] font-black uppercase italic text-xl mb-6">Budget vs Actual</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { name: 'Budget', amount: stats.budget },
                                            { name: 'Actual', amount: stats.totalCost },
                                        ]}
                                    >
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="amount" fill="#102C57" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-400 font-bold">Select a trip to view analytics.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BudgetView;
