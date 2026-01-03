from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI()

# --- 1. CONFIGURATION ---
origins = [
    "http://localhost:3000",
    "http://localhost:5173"
]
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
    time: str = "10:00 AM"  # Default time
    image: Optional[str] = ""
    image: Optional[str] = ""
    description: Optional[str] = ""

class User(BaseModel):
    name: str
    email: str
    password: Optional[str] = None
    location: str
    language: str
    notifications: bool

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
    image_url: Optional[str] = ""
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
    # --- PARIS ---
    {
        "name": "Eiffel Tower Tour", 
        "city": "Paris", 
        "type": "Sightseeing", 
        "cost": 50, 
        "image": "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80",
        "description": "Skip-the-line access to the top of the Iron Lady with a guide."
    },
    {
        "name": "Louvre Museum", 
        "city": "Paris", 
        "type": "Sightseeing", 
        "cost": 30,
        "image": "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&w=600&q=80", 
        "description": "Discover the Mona Lisa and thousands of other masterpieces."
    },
    {
        "name": "Seine River Cruise", 
        "city": "Paris", 
        "type": "Sightseeing", 
        "cost": 20,
        "image": "https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=600&q=80", 
        "description": "A romantic evening cruise down the Seine river."
    },

    # --- PARIS ---
    {
        "name": "Eiffel Tower Tour", 
        "city": "Paris", 
        "type": "Sightseeing", 
        "cost": 50, 
        "time": "10:00 AM",
        "image": "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=600&q=80",
        "description": "Skip-the-line access to the top of the Iron Lady with a guide."
    },
    {
        "name": "Louvre Museum", 
        "city": "Paris", 
        "type": "Sightseeing", 
        "cost": 30,
        "time": "10:00 AM",
        "image": "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&w=600&q=80", 
        "description": "Discover the Mona Lisa and thousands of other masterpieces."
    },
    {
        "name": "Seine River Cruise", 
        "city": "Paris", 
        "type": "Sightseeing", 
        "cost": 20,
        "time": "07:00 PM",
        "image": "https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=600&q=80", 
        "description": "A romantic evening cruise down the Seine river."
    },

    # --- BERLIN ---
    {
        "name": "Street Food Walk", 
        "city": "Berlin", 
        "type": "Food", 
        "cost": 20,
        "time": "12:00 PM",
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
        "description": "Taste the best Currywurst and Kebabs in Kreuzberg."
    },
    {
        "name": "Berlin Wall Tour", 
        "city": "Berlin", 
        "type": "Sightseeing", 
        "cost": 15,
        "time": "10:00 AM",
        "image": "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80",
        "description": "Historical walking tour along the remains of the Berlin Wall."
    },

    # --- BALI ---
    {
        "name": "Scuba Diving", 
        "city": "Bali", 
        "type": "Adventure", 
        "cost": 100,
        "time": "09:00 AM",
        "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        "description": "Explore the vibrant coral reefs of Nusa Penida."
    },
    {
        "name": "Rice Terrace Trek", 
        "city": "Bali", 
        "type": "Adventure", 
        "cost": 30,
        "time": "08:00 AM",
        "image": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
        "description": "Walk through the lush green Tegalalang Rice Terraces."
    },
    {
        "name": "Ubud Monkey Forest", 
        "city": "Bali", 
        "type": "Sightseeing", 
        "cost": 10,
        "time": "03:00 PM",
        "image": "https://images.unsplash.com/photo-1572455986968-0740523f66c0?auto=format&fit=crop&w=600&q=80",
        "description": "Visit the sacred sanctuary of the long-tailed macaques."
    },

    # --- TOKYO ---
    {
        "name": "Sushi Making Class", 
        "city": "Tokyo", 
        "type": "Food", 
        "cost": 80,
        "time": "11:00 AM",
        "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=600&q=80",
        "description": "Learn the art of authentic sushi making from a master chef."
    },
    {
        "name": "Shibuya Crossing", 
        "city": "Tokyo", 
        "type": "Sightseeing", 
        "cost": 0,
        "time": "05:00 PM",
        "image": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80",
        "description": "Experience the world's busiest pedestrian crossing."
    },

    # --- DUBAI ---
    {
        "name": "Desert Safari", 
        "city": "Dubai", 
        "type": "Adventure", 
        "cost": 60,
        "time": "04:00 PM",
        "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
        "description": "Dune bashing, camel riding, and BBQ dinner under the stars."
    },
    {
        "name": "Burj Khalifa Top", 
        "city": "Dubai", 
        "type": "Sightseeing", 
        "cost": 45,
        "time": "06:00 PM",
        "image": "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=600&q=80",
        "description": "Vews from the 124th floor of the world's tallest building."
    },

    # --- SANTORINI ---
    {
        "name": "Catamaran Sunset Cruise", 
        "city": "Santorini", 
        "type": "Adventure", 
        "cost": 120,
        "time": "05:00 PM",
        "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80",
        "description": "Sail around the caldera with dinner and unlimited drinks."
    },

     # --- REYKJAVIK ---
    {
        "name": "Blue Lagoon Spa", 
        "city": "Reykjavik", 
        "type": "Adventure", 
        "cost": 90,
        "time": "02:00 PM",
        "image": "https://images.unsplash.com/photo-1504123010103-a282bc2bb3fe?auto=format&fit=crop&w=600&q=80",
        "description": "Relax in the geothermal seawater spa."
    },
    {
        "name": "Northern Lights Tour", 
        "city": "Reykjavik", 
        "type": "Sightseeing", 
        "cost": 70,
        "time": "09:00 PM",
        "image": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80",
        "description": "Hunt for the aurora borealis in the dark Icelandic winter."
    },

    # --- HANOI ---
    {
        "name": "Ha Long Bay Day Trip", 
        "city": "Hanoi", 
        "type": "Adventure", 
        "cost": 50,
        "time": "08:00 AM",
        "image": "https://images.unsplash.com/photo-1555944858-752c8a1b9bc7?auto=format&fit=crop&w=600&q=80",
        "description": "Cruise through the emerald waters and limestone islands."
    },
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
# --- 3. MOCK DATABASES (Pre-filled for the Hackathon) ---

USERS_DB = [
    {
        "name": "Vishal",
        "email": "admin@globe.com",
        "password": "123",
        "location": "Mumbai, India",
        "language": "English",
        "notifications": True
    }
]

# ... [Search DBs Code] ...

@app.post("/login")
def login(user: LoginRequest):
    for u in USERS_DB:
        if u["email"] == user.email and u["password"] == user.password:
             return {"status": "success", "user": u, "role": "admin" if "admin" in user.email else "user"}
    raise HTTPException(status_code=401, detail="Invalid Credentials")

@app.post("/register")
def register(user: User):
    for u in USERS_DB:
        if u["email"] == user.email:
             raise HTTPException(status_code=400, detail="Email already registered")
    USERS_DB.append(user.dict())
    return {"status": "success", "user": user}

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

@app.get("/profile")
def get_profile(email: str):
    for u in USERS_DB:
        if u["email"] == email:
            return u
    raise HTTPException(status_code=404, detail="User not found")

@app.put("/profile")
def update_profile(updated_user: User):
    for i, u in enumerate(USERS_DB):
        if u["email"] == updated_user.email:
            USERS_DB[i] = updated_user.dict()
            return {"status": "success", "user": updated_user}
    raise HTTPException(status_code=404, detail="User not found")

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
    # Calculate most popular destination
    city_counts = {}
    for trip in TRIPS_DB:
        for stop in trip["stops"]:
            city = stop["city_name"]
            city_counts[city] = city_counts.get(city, 0) + 1
    
    popular_city = max(city_counts, key=city_counts.get) if city_counts else "N/A"

    return {
        "total_users": len(USERS_DB),
        # Add mock growth data for the chart since we don't track history yet
        "user_growth": [
            {"name": "Jan", "users": 10}, {"name": "Feb", "users": 20},
            {"name": "Mar", "users": 45}, {"name": "Apr", "users": 80},
            {"name": "May", "users": 110}, {"name": "Jun", "users": len(USERS_DB)}
        ],
        "total_trips": len(TRIPS_DB),
        "most_popular_destination": popular_city,
        "revenue": f"${len(TRIPS_DB) * 10}", # Mock revenue model: $10/trip
        "recent_users": USERS_DB[-5:] # Return last 5 users
    }