import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="bg-[#102C57] p-2 rounded-lg shadow-lg flex items-center justify-center">
                    <span className="text-white text-xl">✈️</span>
                </div>
                <h2 className="text-[#102C57] font-black italic tracking-tighter text-2xl uppercase">Globetrotter</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                    <button className="hover:text-[#102C57] transition-colors" onClick={() => navigate('/dashboard')}>My Trips</button>
                    <button className="hover:text-[#102C57] transition-colors" onClick={() => navigate('/city-search')}>City Search</button>
                    <button className="hover:text-[#102C57] transition-colors" onClick={() => navigate('/activity-search')}>Activity Search</button>
                    <button className="hover:text-[#102C57] transition-colors" onClick={() => navigate('/budget')}>Trip Budget</button>
                    <button className="hover:text-[#102C57] transition-colors" onClick={() => navigate('/calendar')}>Timeline</button>
                </div>
                <button
                    onClick={() => navigate('/profile')}
                    className="bg-slate-100 text-[#102C57] px-4 py-2 rounded-xl font-black text-[10px] hover:bg-slate-200 transition-all uppercase tracking-widest mr-2"
                >
                    Profile 👤
                </button>
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-black text-white px-4 py-2 rounded-xl font-black text-[10px] hover:bg-slate-800 transition-all uppercase tracking-widest mr-2"
                >
                    Admin ⚙️
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-black text-[10px] hover:bg-red-50 hover:text-red-600 transition-all uppercase tracking-widest"
                >
                    Logout ⎋
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
