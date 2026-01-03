import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const SUGGESTIONS_DB = [
    // --- SOLO TRAVEL ---
    {
        id: 1,
        name: "Berlin",
        country: "Germany",
        image_url: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=400&q=80",
        reason: "Extremely safe with world-class hostels and vibrant solo-friendly nightlife.",
        daily_budget_inr: 8000,
        category_type: "Solo"
    },
    {
        id: 2,
        name: "Hanoi",
        country: "Vietnam",
        image_url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
        reason: "Very affordable for backpackers and easy to meet other travelers.",
        daily_budget_inr: 2500,
        category_type: "Solo"
    },
    {
        id: 3,
        name: "Reykjavik",
        country: "Iceland",
        image_url: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=400&q=80",
        reason: "Ranked as the safest country in the world for solo explorers.",
        daily_budget_inr: 15000,
        category_type: "Solo"
    },
    {
        id: 4,
        name: "Kyoto",
        country: "Japan",
        image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80",
        reason: "Perfect for solo meditation and peaceful temple walks.",
        daily_budget_inr: 10000,
        category_type: "Solo"
    },
    {
        id: 5,
        name: "Lisbon",
        country: "Portugal",
        image_url: "https://images.unsplash.com/photo-1548705085-101177834f47?auto=format&fit=crop&w=400&q=80",
        reason: "Great climate and walkable hills, perfect for solo photography.",
        daily_budget_inr: 6000,
        category_type: "Solo"
    },
    {
        id: 6,
        name: "Chiang Mai",
        country: "Thailand",
        image_url: "https://images.unsplash.com/photo-1598970425983-cda6e38b3294?auto=format&fit=crop&w=400&q=80",
        reason: "The digital nomad hub; you'll never feel alone here.",
        daily_budget_inr: 3000,
        category_type: "Solo"
    },

    // --- COUPLES ---
    {
        id: 7,
        name: "Santorini",
        country: "Greece",
        image_url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=400&q=80",
        reason: "Breathtaking sunsets and private villas overlooking the caldera.",
        daily_budget_inr: 18000,
        category_type: "Couple"
    },
    {
        id: 8,
        name: "Paris",
        country: "France",
        image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
        reason: "The ultimate 'City of Love' with romantic walks along the Seine.",
        daily_budget_inr: 14000,
        category_type: "Couple"
    },
    {
        id: 9,
        name: "Udaipur",
        country: "India",
        image_url: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=400&q=80",
        reason: "The Venice of the East; lake palaces for a royal romantic stay.",
        daily_budget_inr: 7000,
        category_type: "Couple"
    },
    {
        id: 10,
        name: "Venice",
        country: "Italy",
        image_url: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80",
        reason: "Gondola rides through canals offer a timeless experience.",
        daily_budget_inr: 16000,
        category_type: "Couple"
    },
    {
        id: 11,
        name: "Bali",
        country: "Indonesia",
        image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
        reason: "Affordable luxury with private pool villas and jungle vibes.",
        daily_budget_inr: 5000,
        category_type: "Couple"
    },
    {
        id: 12,
        name: "Maldives",
        country: "Maldives",
        image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80",
        reason: "Ultimate privacy with overwater bungalows and turquoise lagoons.",
        daily_budget_inr: 25000,
        category_type: "Couple"
    },

    // --- FAMILY / GROUP ---
    {
        id: 13,
        name: "Munich",
        country: "Germany",
        image_url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80",
        reason: "Incredible parks and science museums for all age groups.",
        daily_budget_inr: 11000,
        category_type: "Family"
    },
    {
        id: 14,
        name: "Orlando",
        country: "USA",
        image_url: "https://images.unsplash.com/photo-1597460333968-0fa396602324?auto=format&fit=crop&w=400&q=80",
        reason: "The world capital of family fun with iconic theme parks.",
        daily_budget_inr: 20000,
        category_type: "Family"
    },
    {
        id: 15,
        name: "Singapore",
        country: "Singapore",
        image_url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=400&q=80",
        reason: "Super clean, easy transport, and safe for large families.",
        daily_budget_inr: 12000,
        category_type: "Family"
    },
    {
        id: 16,
        name: "Gold Coast",
        country: "Australia",
        image_url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80",
        reason: "Great beaches and theme parks for group activities.",
        daily_budget_inr: 13000,
        category_type: "Family"
    },
    {
        id: 17,
        name: "London",
        country: "UK",
        image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80",
        reason: "History comes alive with Harry Potter tours and interactive museums.",
        daily_budget_inr: 15000,
        category_type: "Family"
    },
    {
        id: 18,
        name: "Dubai",
        country: "UAE",
        image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80",
        reason: "Indoor theme parks and desert safaris suitable for all ages.",
        daily_budget_inr: 12000,
        category_type: "Family"
    },
];

const CreateTrip = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '2000',
        travelers: '1', // 1=Solo, 2=Family, 3=Couple
        description: '',
        imageUrl: ''
    });

    const filteredSuggestions = useMemo(() => {
        let category = "Solo";
        if (formData.travelers === "2") category = "Family";
        if (formData.travelers === "3") category = "Couple";

        return SUGGESTIONS_DB.filter(item => item.category_type === category);
    }, [formData.travelers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const tripData = {
            name: formData.destination,
            start_date: formData.startDate,
            end_date: formData.endDate,
            budget_limit: parseInt(formData.budget) || 0,
            description: formData.description,
            image_url: formData.imageUrl || "", // We need to store the selected image URL
            stops: []
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripData),
            });

            if (response.ok) {
                setTimeout(() => {
                    setLoading(false);
                    setShowSuccess(true);
                    setTimeout(() => {
                        navigate('/dashboard'); // Go to dashboard to see the trip
                    }, 2000);
                }, 1500);
            } else {
                console.error("Failed to save trip");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error saving trip:", error);
            setLoading(false);
        }
    };

    const handleSuggestionClick = (item) => {
        setFormData({
            ...formData,
            destination: item.name,
            budget: item.daily_budget_inr,
            description: item.reason,
            imageUrl: item.image_url // Store image URL in state
        });
    }

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

            {/* NAVIGATION BAR */}
            <div className="absolute top-0 w-full z-10">
                <Navbar />
            </div>

            <div className="max-w-4xl w-full space-y-8 mt-20">

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
                                <input type="text" required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold" placeholder="e.g. Summer in Paris 2025" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} />
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
                                <input type="number" placeholder="2000" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#102C57] uppercase tracking-widest mb-2 ml-1">Travelers</label>
                                <select className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}>
                                    <option value="1">Solo Traveler</option>
                                    <option value="2">Family</option>
                                    <option value="3">Couple</option>
                                </select>
                            </div>

                            {/* Trip Description (INTEGRATED) */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-[#102C57] uppercase tracking-widest mb-2 ml-1">Trip Description</label>
                                <textarea rows="3" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#102C57] outline-none font-bold" placeholder="What are your goals? Sightseeing, relaxing, food..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                        </div>

                        {/* Suggestions Grid (6 Images) */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Suggested Destinations {formData.travelers === "1" ? "(Solo)" : formData.travelers === "3" ? "(Couples)" : "(Family)"}</label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {filteredSuggestions.map((item) => (
                                    <div key={item.id} className="group cursor-pointer" onClick={() => handleSuggestionClick(item)}>
                                        <div className="aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-transparent group-hover:border-[#102C57] transition-all bg-gray-100">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
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
