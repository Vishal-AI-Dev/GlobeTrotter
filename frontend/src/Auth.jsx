import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        phone: '', city: '', country: '', additionalInfo: ''
    });

    // Handle Photo Upload & Storage
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                localStorage.setItem('userPhoto', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Google Login Bypass for Demo
    const handleGoogleLogin = () => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', 'Traveler Admin');
        navigate('/dashboard');
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        if (isLogin) {
            // --- LOGIN LOGIC ---
            try {
                const response = await fetch('http://127.0.0.1:8000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userName', data.user.name);
                    localStorage.setItem('userEmail', data.user.email); // Store for Profile fetching
                    navigate('/dashboard');
                } else {
                    setError("Invalid Credentials. Please try admin@globe.com / 123");
                }
            } catch (err) {
                setError("Login failed. Is the backend running?");
            }
        } else {
            // --- REGISTRATION LOGIC ---
            try {
                // Construct user object matching Pydantic model
                const newUser = {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password,
                    location: `${formData.city}, ${formData.country}`,
                    language: 'English',
                    notifications: true
                };

                const response = await fetch('http://127.0.0.1:8000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });

                if (response.ok) {
                    alert("Registration Successful! Please login.");
                    setIsLogin(true);
                } else {
                    const data = await response.json();
                    setError(data.detail || "Registration failed");
                }
            } catch (err) {
                setError("Registration failed. Backend error.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-4">

            {/* BRANDING LOGO (Replacing the 'G' with a Plane) */}
            <div className="flex items-center gap-2 mb-6 self-start md:ml-10">
                <div className="bg-[#102C57] p-2 rounded-lg shadow-lg flex items-center justify-center">
                    <span className="text-white text-xl">✈️</span>
                </div>
                <h2 className="text-[#102C57] font-black italic tracking-tighter text-2xl uppercase">Globetrotter</h2>
            </div>

            <div className="w-full max-w-[480px] bg-white rounded-[50px] shadow-[0_40px_80px_-15px_rgba(16,44,87,0.25)] border border-white overflow-hidden relative">

                {/* HEADER SECTION (Replacing the 'G' with a Plane) */}
                <div className="bg-[#102C57] pt-14 pb-24 px-10 text-center relative">
                    <div className="flex justify-center mb-3">
                        <span className="text-4xl">✈️</span>
                    </div>
                    <h1 className="text-white text-3xl font-black uppercase tracking-[0.25em] italic leading-none">Globetrotter</h1>
                    <p className="text-blue-300 text-[10px] font-bold uppercase mt-3 tracking-[0.3em] opacity-70">Travel Systems v2.0</p>

                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-45px]">
                        <label className="cursor-pointer block">
                            <div className="w-24 h-24 rounded-full border-[6px] border-white bg-slate-50 shadow-xl flex items-center justify-center overflow-hidden transition-all hover:scale-105 hover:shadow-2xl">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-2">
                                        <span className="text-xl">📸</span>
                                        <p className="text-[7px] font-black text-slate-400 uppercase mt-1">Add Photo</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                </div>

                <div className="p-10 pt-16">
                    <div className="flex justify-center gap-8 mb-8">
                        <button onClick={() => setIsLogin(true)} className={`text-[11px] font-black tracking-widest uppercase transition-all ${isLogin ? 'text-[#102C57] border-b-2 border-[#102C57] pb-1' : 'text-slate-300'}`}>Sign In</button>
                        <button onClick={() => setIsLogin(false)} className={`text-[11px] font-black tracking-widest uppercase transition-all ${!isLogin ? 'text-[#102C57] border-b-2 border-[#102C57] pb-1' : 'text-slate-300'}`}>Register</button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-6">
                            <p className="text-red-600 text-[10px] font-bold uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isLogin ? (
                            <>
                                <input name="email" type="email" placeholder="Email Address" className="sketch-input" onChange={handleInputChange} required />
                                <input name="password" type="password" placeholder="Password" className="sketch-input" onChange={handleInputChange} required />
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <input name="firstName" placeholder="First Name" className="sketch-input" onChange={handleInputChange} required />
                                <input name="lastName" placeholder="Last Name" className="sketch-input" onChange={handleInputChange} required />
                                <input name="email" type="email" placeholder="Email" className="sketch-input col-span-2" onChange={handleInputChange} required />
                                <input name="password" type="password" placeholder="Password" className="sketch-input col-span-2" onChange={handleInputChange} required />
                                <input name="city" placeholder="City" className="sketch-input" onChange={handleInputChange} />
                                <input name="country" placeholder="Country" className="sketch-input" onChange={handleInputChange} />
                            </div>
                        )}

                        <button type="submit" className="w-full bg-[#102C57] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-blue-900 active:scale-95 transition-all mt-2">
                            {isLogin ? 'Access System →' : 'Complete Registration'}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="relative my-8 text-center">
                        <hr className="border-slate-100" />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[9px] font-black text-slate-300 uppercase">Or</span>
                    </div>

                    {/* GOOGLE BUTTON */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full border-2 border-slate-100 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5" />
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
