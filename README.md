# 🌍 GlobeTrotter: Personalized Travel Planning Platform

**GlobeTrotter** is a smart, collaborative platform designed to simplify the complexity of multi-city travel planning. It empowers users to design itineraries, manage budgets, and explore global destinations in one integrated interface.

---

## 🚀 Key Features (Hackathon MVP)
- **Multi-City Itinerary Builder:** Create structured, day-wise plans with specific activities and timestamps.
- **Smart Budget Estimator:** Automated cost breakdowns based on travel style (Backpacker, Medium, Luxury).
- **AI-Powered Itinerary Generator:** Instant generation of suggested activities for any city using our simulated AI engine.
- **City & Activity Discovery:** Integrated search interface to find destinations with real-time cost indices.
- **Public Trip Sharing:** Generate unique, shareable URLs for public itinerary viewing.
- **Admin Dashboard:** High-level analytics to track platform usage and popular destinations.

---

## 🛠️ Technical Architecture

### Backend (Python FastAPI)
- **FastAPI:** High-performance asynchronous API framework.
- **Pydantic:** Strict data validation models for error-free frontend integration.
- **RESTful Endpoints:** Full CRUD operations for trips, cities, and activities.
- **CORS Middleware:** Configured for seamless communication with the React frontend.

### Frontend (React.js)
- **Tailwind CSS:** Modern, responsive design using a "Navy & White" professional theme.
- **React Router:** Smooth navigation across the 13 planned application screens.
- **Axios:** Robust handling of asynchronous API calls to the Python backend.

---

## 🚦 Getting Started

### 1. Prerequisites
- Python 3.8+
- Node.js & npm

### 2. Backend Setup
```bash
# Navigate to the server directory
cd server

# Install dependencies
pip install fastapi uvicorn pydantic

# Launch the server
python -m uvicorn main:app --reload
