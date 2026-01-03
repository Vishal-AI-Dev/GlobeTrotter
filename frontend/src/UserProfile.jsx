import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Defensive: function to get safe string
    const safeStr = (str) => str || "";

    const fetchProfile = async () => {
        setLoading(true);
        setError('');
        try {
            // Get email from localStorage or fallback
            // IMPORTANT: If you are seeing a white screen, try clearing localStorage in dev tools or re-login
            const userEmail = localStorage.getItem('userEmail') || "admin@globe.com";

            console.log("Fetching profile for:", userEmail);
            const response = await fetch(`http://127.0.0.1:8000/profile?email=${userEmail}`);

            if (response.ok) {
                const data = await response.json();
                console.log("Profile data received:", data);
                setUser(data);
            } else {
                console.error("Profile not found");
                setError("Profile not found. Please login again.");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError("Network error. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        try {
            const response = await fetch('http://127.0.0.1:8000/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                setIsEditing(false);
                alert("Profile updated successfully!");
                fetchProfile(); // Refresh
            } else {
                alert("Failed to save. Please try again.");
            }
        } catch (error) {
            alert("Failed to update profile");
        }
    };

    const handleDeleteAccount = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account scheduled for deletion.");
            localStorage.clear();
            navigate('/');
        }
    };

    const handleChange = (field, value) => {
        if (user) {
            setUser({ ...user, [field]: value });
        }
    };

    // --- RENDER STATES ---
    if (loading) return (
        <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center font-sans">
            <div className="text-[#102C57] font-black uppercase text-xl animate-pulse">Loading Profile...</div>
        </div>
    );

    if (error || !user) return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center font-sans gap-4">
            <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 text-center shadow-lg">
                <h2 className="font-black text-xl mb-2">Something went wrong</h2>
                <p className="font-bold text-sm mb-4">{error || "User data unavailable"}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-colors"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans">
            <Navbar />

            <main className="p-8 max-w-[800px] mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black uppercase italic text-[#102C57] tracking-tighter">
                        Profile & Settings
                    </h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-2 rounded-xl font-black uppercase text-xs tracking-widest border transition-colors ${isEditing ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-[#102C57] border-slate-200 hover:bg-slate-50'}`}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile ✎'}
                    </button>
                </div>

                <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
                    {/* PROFILE HEADER */}
                    <div className="h-32 bg-gradient-to-r from-[#102C57] to-blue-900 relative"></div>
                    <div className="px-10 pb-10 relative">
                        {/* Avatar: Uses DiceBear with user's name as seed */}
                        <div className="w-24 h-24 bg-white rounded-full absolute -top-12 border-4 border-white shadow-md flex items-center justify-center text-4xl overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${safeStr(user.name)}`}
                                alt="avatar"
                                className="w-full h-full"
                            />
                        </div>

                        <div className="mt-16 space-y-8">
                            {/* Personal Info */}
                            <div>
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-[#102C57] mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={safeStr(user.name)}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className={`w-full p-3 rounded-xl border-none bg-slate-50 font-bold text-slate-700 ${isEditing ? 'ring-2 ring-blue-100' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#102C57] mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            disabled={true} // Email should usually be immutable
                                            value={safeStr(user.email)}
                                            className="w-full p-3 rounded-xl border-none bg-slate-100 text-slate-400 font-bold cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#102C57] mb-2">Location</label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={safeStr(user.location)}
                                            onChange={(e) => handleChange('location', e.target.value)}
                                            className={`w-full p-3 rounded-xl border-none bg-slate-50 font-bold text-slate-700 ${isEditing ? 'ring-2 ring-blue-100' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div>
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-[#102C57] mb-2">Language</label>
                                        <select
                                            disabled={!isEditing}
                                            value={safeStr(user.language)}
                                            onChange={(e) => handleChange('language', e.target.value)}
                                            className={`w-full p-3 rounded-xl border-none bg-slate-50 font-bold text-slate-700 ${isEditing ? 'ring-2 ring-blue-100' : ''}`}
                                        >
                                            <option>English</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>Hindi</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-4 pt-6">
                                        <div
                                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${user.notifications ? 'bg-[#102C57]' : 'bg-slate-300'} ${!isEditing ? 'pointer-events-none opacity-50' : ''}`}
                                            onClick={() => isEditing && handleChange('notifications', !user.notifications)}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${user.notifications ? 'translate-x-6' : ''}`}></div>
                                        </div>
                                        <span className="text-xs font-bold text-[#102C57]">Email Notifications</span>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            {isEditing && (
                                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                    <button
                                        onClick={handleSave}
                                        className="bg-[#102C57] text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-900 transition-colors shadow-lg"
                                    >
                                        Save Changes 💾
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="text-red-500 font-black uppercase text-xs tracking-widest hover:text-red-700 transition-colors bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100"
                                    >
                                        Delete Account 🗑️
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
