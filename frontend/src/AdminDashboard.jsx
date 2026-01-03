import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/admin/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center text-[#102C57]">Loading analytics...</div>;

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <Navbar />

            <main className="p-8 max-w-[1200px] mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black uppercase italic text-[#102C57] tracking-tighter mb-2">
                        Admin Analytics
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">
                        Platform usage and performance
                    </p>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Users</h3>
                        <p className="text-4xl font-black text-[#102C57]">{stats.total_users}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Trips</h3>
                        <p className="text-4xl font-black text-[#102C57]">{stats.total_trips}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Top Destination</h3>
                        <p className="text-2xl font-black text-pink-500 uppercase">{stats.most_popular_destination}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Revenue</h3>
                        <p className="text-4xl font-black text-green-500">{stats.revenue}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* CHART 1: USER GROWTH */}
                    <div className="bg-white p-8 rounded-[30px] shadow-lg border border-slate-100">
                        <h3 className="text-[#102C57] font-black uppercase italic text-xl mb-6">User Growth Trend</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.user_growth}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="users" stroke="#102C57" strokeWidth={4} dot={{ fill: '#102C57', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* USER TABLE */}
                    <div className="bg-white p-8 rounded-[30px] shadow-lg border border-slate-100">
                        <h3 className="text-[#102C57] font-black uppercase italic text-xl mb-6">Recent Users</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
                                        <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recent_users && stats.recent_users.map((user, i) => (
                                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 font-bold text-[#102C57]">{user.name}</td>
                                            <td className="py-4 text-sm font-semibold text-slate-500">{user.email}</td>
                                            <td className="py-4 text-sm font-semibold text-slate-500">{user.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
