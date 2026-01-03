from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI()

# --- 1. CONFIGURATION ---
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. DATA MODELS (The "Contract" with Frontend) ---

class Activity(BaseModel):
    name: str
    type: str  # e.g., "Sightseeing", "Food", "Adventure"
    cost: int
    time: str  # e.g., "10:00 AM"

class Stop(BaseModel):
    city_name: str
    arrival_date: str
    departure_date: str
    activities: List[Activity] = []

class Trip(BaseModel):
    id: Optional[int] = None
    name: str
    start_date: str
    end_date: str
    budget_limit: int
    description: Optional[str] = ""
    stops: List[Stop] = [] 
    # The frontend will calculate total cost by summing up activities + transport

class LoginRequest(BaseModel):
    email: str
    password: str

# --- 3. MOCK DATABASES (Pre-filled for the Hackathon) ---

# SCREENS 7 & 8: Search Databases
# UPDATE THIS PART ONLY
CITIES_DB = [
    {
        "name": "Paris", 
        "country": "France", 
        "cost_index": "High", 
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=60"
    },
    {
        "name": "Berlin", 
        "country": "Germany", 
        "cost_index": "Medium", 
        "image": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=500&q=60"
    },
    {
        "name": "Tokyo", 
        "country": "Japan", 
        "cost_index": "High", 
        "image": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=60"
    },
    {
        "name": "Bali", 
        "country": "Indonesia", 
        "cost_index": "Low", 
        "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=60"
    },
    {
        "name": "New York", 
        "country": "USA", 
        "cost_index": "Very High", 
        "image": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=60"
    },
]

ACTIVITIES_DB = [
    {"name": "Eiffel Tower Tour", "city": "Paris", "type": "Sightseeing", "cost": 50},
    {"name": "Louvre Museum", "city": "Paris", "type": "Sightseeing", "cost": 30},
    {"name": "Street Food Walk", "city": "Berlin", "type": "Food", "cost": 20},
    {"name": "Scuba Diving", "city": "Bali", "type": "Adventure", "cost": 100},
]

# SCREENS 2 & 4: Trip Database
TRIPS_DB = [
    {
        "id": 1,
        "name": "Euro Summer 2026",
        "start_date": "2026-06-01",
        "end_date": "2026-06-15",
        "budget_limit": 5000,
        "description": "Dream trip to France and Germany",
        "stops": [
            {
                "city_name": "Paris",
                "arrival_date": "2026-06-01",
                "departure_date": "2026-06-05",
                "activities": [
                    {"name": "Eiffel Tower Tour", "type": "Sightseeing", "cost": 50, "time": "10:00 AM"}
                ]
            }
        ]
    }
]

# --- 4. API ENDPOINTS ---

@app.get("/")
def home():
    return {"message": "GlobeTrotter API Ready"}

# SCREEN 1: Login
@app.post("/login")
def login(user: LoginRequest):
    if user.email == "admin@globe.com" and user.password == "123":
        return {"status": "success", "user": "Vishal", "role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid Credentials")

# SCREEN 2 & 4: Dashboard & My Trips
@app.get("/trips")
def get_all_trips():
    return TRIPS_DB

# SCREEN 3: Create Trip
@app.post("/trips")
def create_trip(trip: Trip):
    trip.id = len(TRIPS_DB) + 1
    TRIPS_DB.append(trip.dict())
    return {"status": "success", "trip": trip}

# SCREEN 5 & 6: Itinerary Details
@app.get("/trips/{trip_id}")
def get_trip_details(trip_id: int):
    for trip in TRIPS_DB:
        if trip["id"] == trip_id:
            return trip
    raise HTTPException(status_code=404, detail="Trip not found")

# SCREEN 5 (Advanced): Update Itinerary (Add stops/activities)
@app.put("/trips/{trip_id}")
def update_trip(trip_id: int, updated_trip: Trip):
    for i, trip in enumerate(TRIPS_DB):
        if trip["id"] == trip_id:
            TRIPS_DB[i] = updated_trip.dict()
            return {"status": "updated", "trip": updated_trip}
    raise HTTPException(status_code=404, detail="Trip not found")

# SCREEN 7: City Search
@app.get("/search/cities")
def search_cities(q: str = ""):
    q = q.lower()
    return [c for c in CITIES_DB if q in c["name"].lower() or q in c["country"].lower()]

# SCREEN 8: Activity Search
@app.get("/search/activities")
def search_activities(city: str):
    return [a for a in ACTIVITIES_DB if a["city"].lower() == city.lower()]

# SCREEN 13: Admin Stats
@app.get("/admin/stats")
def get_stats():
    return {
        "total_users": 142,
        "total_trips": len(TRIPS_DB),
        "most_popular_destination": "Paris",
        "revenue": "$0 (Free App)"
    }