import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '2000',
        travelers: '1',
        description: ''
    });

    // Placeholder images for the suggestions grid
    const suggestions = [
        { id: 1, name: 'Eiffel Tower', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400' },
        { id: 2, name: 'Bali Temples', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
        { id: 3, name: 'Tokyo Neon', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
        { id: 4, name: 'Swiss Alps', img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=400' },
        { id: 5, name: 'Santorini', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400' },
        { id: 6, name: 'Grand Canyon', img: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/itinerary-view');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-6 lg:p-12 flex justify-center relative overflow-hidden">

            {showSuccess && (
                <div className="fixed inset-0 bg-[#102C57]/95 backdrop-blur-xl z-[200] flex items-center justify-center p-6 text-center">
                    <div className="bg-white p-12 rounded-[50px] shadow-2xl animate-pulse">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">✅</div>
                        <h2 className="text-4xl font-black text-[#102C57] uppercase tracking-tighter italic">Trip Created!</h2>
                        <p className="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">Syncing with Odoo Database...</p>
                    </div>
                </div>
            )}

            <div className="max-w-4xl w-full space-y-8">
                {/* Branding Logo (Consistent with other pages) */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#102C57] p-2 rounded-xl shadow-lg">
                        <span className="text-white text-xl">✈️</span>
                    </div>
                    <h2 className="text-[#102C57] font-black italic tracking-tighter text-2xl uppercase">Globetrotter</h2>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-[#102C57] p-10 text-white text-center relative">
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Plan Your Adventure</h2>
                        <p className="text-blue-200 text-xs mt-2 font-bold tracking-widest uppercase opacity-80 italic">AI-Powered Engine V2.0</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Trip Name/Destination */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-[#102C57] uppercase tracking-widest mb-2 ml-1">Trip Name / Destination</label>
                                <input type="text" required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold" placeholder="e.g. Summer in Paris 2025" onChange={(e) => setFormData({ ...formData, destination: e.target.value })} />
                            </div>

                            {/* Dates */}
                            <div>
                                <label className="block text-[10px] font-black text-[#102C57] uppercase tracking-widest mb-2 ml-1">Start Date</label>
                                <input type="date" required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold text-sm" onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#102C57] uppercase tracking-widest mb-2 ml-1">End Date</label>
                                <input type="date" required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold text-sm" onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                            </div>

                            {/* Budget (TEXT METHOD) & Travelers */}
                            <div>
                                <label className="block text-[10px] font-black text-[#102C57] uppercase tracking-widest mb-2 ml-1">Budget ($)</label>
                                <input type="number" placeholder="2000" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold" onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#102C57] uppercase tracking-widest mb-2 ml-1">Travelers</label>
                                <select className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold" onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}>
                                    <option value="1">Solo Traveler</option>
                                    <option value="2">Family</option>
                                    <option value="3">Couple</option>
                                </select>
                            </div>

                            {/* Trip Description (INTEGRATED) */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-[#102C57] uppercase tracking-widest mb-2 ml-1">Trip Description</label>
                                <textarea rows="3" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold" placeholder="What are your goals? Sightseeing, relaxing, food..." onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                        </div>

                        {/* Suggestions Grid (6 Images) */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Suggestions for places to visit / Activities</label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {suggestions.map((item) => (
                                    <div key={item.id} className="group cursor-pointer">
                                        <div className="aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-transparent group-hover:border-[#102C57] transition-all">
                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        </div>
                                        <p className="text-[8px] font-black uppercase text-[#102C57] mt-1 text-center opacity-0 group-hover:opacity-100">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className={`w-full font-black py-5 rounded-[25px] transition-all shadow-xl text-lg uppercase tracking-tighter flex items-center justify-center gap-3 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#102C57] text-white hover:bg-blue-600 active:scale-95'}`}>
                            {loading ? '⚙️ Crafting...' : 'Save Trip & Generate →'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip;