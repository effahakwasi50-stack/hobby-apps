"""
VacationHub Ghana - Backend Python API (app.py)
Provides RESTful endpoints for Ghana leisure destinations, hostels, hotels, 
beaches, resorts, restaurants, search, and AI-powered vacation itinerary planning.
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load destinations and venues data
DESTINATIONS = [
    {
        "id": "accra",
        "name": "Accra Capital & Atlantic Coast",
        "country": "Greater Accra, Ghana",
        "tagline": "Vibrant Atlantic coastlines, 5-star hotels, rooftop lounges, hostels & fine dining",
        "center": {"lat": 5.5560, "lng": -0.1969},
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    },
    {
        "id": "kumasi",
        "name": "Kumasi Garden City & Ashanti Hub",
        "country": "Ashanti Region, Ghana",
        "tagline": "Historic Ashanti heritage, crater lake beaches, luxury golf resorts, hostels & vibrant eateries",
        "center": {"lat": 6.6885, "lng": -1.6244},
        "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80"
    }
]

VENUES = {
    "accra": [
        {
            "id": "accra-h1",
            "name": "Somewhere Nice Hostel Osu",
            "category": "hostels",
            "categoryLabel": "Boutique Eco Hostel",
            "rating": 4.8,
            "reviewCount": 940,
            "priceLevel": "$",
            "distance": "1.2 mi",
            "distanceKm": 1.9,
            "address": "F732/2 Cotton St, Osu, Accra, Ghana",
            "location": {"lat": 5.5601, "lng": -0.1802},
            "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
            "description": "Accra’s top rated eco-friendly hostel featuring a swimming pool, open air courtyard, shared dorms, private suites, and weekly cultural music nights.",
            "isOpenNow": True,
            "openingHours": "24 Hours",
            "amenities": ["Swimming Pool", "Free High Speed Wi-Fi", "Bar & Cafe", "Shared Kitchen", "Backpacker Tours"]
        },
        {
            "id": "accra-ht1",
            "name": "Kempinski Hotel Gold Coast City",
            "category": "hotels",
            "categoryLabel": "5-Star Ultra Luxury Hotel",
            "rating": 4.9,
            "reviewCount": 3120,
            "priceLevel": "$$$$",
            "distance": "2.1 mi",
            "distanceKm": 3.4,
            "address": "Gamel Abdul Nasser Ave, Ridge, Accra",
            "location": {"lat": 5.5529, "lng": -0.1969},
            "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
            "description": "The standard of luxury in West Africa with an expansive outdoor infinity pool, Resense Spa, and fine dining.",
            "isOpenNow": True,
            "amenities": ["Outdoor Infinity Pool", "Resense Spa", "Fine Dining Restaurant", "Executive Lounge", "Tennis Courts"]
        },
        {
            "id": "accra-b1",
            "name": "Labadi Pleasure Beach",
            "category": "beaches",
            "categoryLabel": "Atlantic Beach & Entertainment",
            "rating": 4.8,
            "reviewCount": 4210,
            "priceLevel": "$",
            "distance": "0.4 mi",
            "distanceKm": 0.6,
            "address": "Labadi Beach Road, La, Accra",
            "location": {"lat": 5.5562, "lng": -0.1472},
            "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
            "description": "Accra’s most famous sandy coastline featuring Atlantic waves, horseback riding, fresh coconut stands, and live music.",
            "isOpenNow": True,
            "amenities": ["Horseback Riding", "Fresh Coconut Kiosks", "Beach Volleyball", "Oceanfront Dining"]
        },
        {
            "id": "accra-r1",
            "name": "Buka Restaurant Osu",
            "category": "restaurants",
            "categoryLabel": "Authentic African & Seafood",
            "rating": 4.8,
            "reviewCount": 3210,
            "priceLevel": "$$",
            "distance": "1.5 mi",
            "distanceKm": 2.4,
            "address": "10th Lane, Osu, Accra, Ghana",
            "location": {"lat": 5.5592, "lng": -0.1812},
            "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
            "description": "Open-air wooden upper terrace serving iconic charcoal-grilled Atlantic tilapia, jollof rice, and plantain.",
            "isOpenNow": True,
            "amenities": ["Terrace Seating", "Charcoal Tilapia", "Jollof & Banku", "Fresh Juices"]
        }
    ],
    "kumasi": [
        {
            "id": "ksi-h1",
            "name": "Kumasi Backpackers Heritage Hostel",
            "category": "hostels",
            "categoryLabel": "Cultural & Eco Hostel",
            "rating": 4.8,
            "reviewCount": 810,
            "priceLevel": "$",
            "distance": "1.2 mi",
            "distanceKm": 1.9,
            "address": "Adum Cultural Strip, Kumasi, Ashanti Region",
            "location": {"lat": 6.6912, "lng": -1.6210},
            "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
            "description": "Backpacker hub in central Kumasi with Ashanti kente decor, courtyard garden, bike rentals, and organized tours.",
            "isOpenNow": True,
            "amenities": ["Free Wi-Fi", "Courtyard Cafe", "Guided Cultural Tours", "Bike Rentals", "Shared Kitchen"]
        },
        {
            "id": "ksi-b1",
            "name": "Lake Bosomtwe Paradise Resort & Beach",
            "category": "beaches",
            "categoryLabel": "Crater Lake Shoreline Beach",
            "rating": 4.9,
            "reviewCount": 2950,
            "priceLevel": "$$",
            "distance": "18.0 mi",
            "distanceKm": 29.0,
            "address": "Abono Lake Shoreline, Lake Bosomtwe, Kumasi",
            "location": {"lat": 6.5383, "lng": -1.4143},
            "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80",
            "description": "Natural meteorite crater lake beach offering swimming, kayaking, boat rides, and fresh grilled tilapia.",
            "isOpenNow": True,
            "amenities": ["Lake Kayaking", "Crater Boat Rides", "Lakeside Sunbeds", "Fresh Tilapia Grill"]
        },
        {
            "id": "ksi-m1",
            "name": "Kumasi City Mall Asokwa",
            "category": "malls",
            "categoryLabel": "Mega Shopping & Entertainment Center",
            "rating": 4.9,
            "reviewCount": 6100,
            "priceLevel": "$$",
            "distance": "2.1 mi",
            "distanceKm": 3.4,
            "address": "Lake Rd, Asokwa, Kumasi, Ghana",
            "location": {"lat": 6.6720, "lng": -1.6050},
            "image": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1000&q=80",
            "description": "Grand modern shopping and leisure complex with Watch & Dine Cinema, food courts, and international retail brands.",
            "isOpenNow": True,
            "amenities": ["Watch & Dine Cinema", "Food Court", "Kid Zone", "Underground Parking"]
        }
    ]
}

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "VacationHub Ghana Backend",
        "version": "1.0.0"
    })

@app.route("/api/destinations", methods=["GET"])
def get_destinations():
    """Returns list of active Ghana destinations"""
    return jsonify(DESTINATIONS)

@app.route("/api/venues", methods=["GET"])
def get_venues():
    """
    Returns venues filtered by destination and optional category.
    Query params:
      - destination: 'accra' or 'kumasi' (default 'accra')
      - category: optional category filter
    """
    destination_id = request.args.get("destination", "accra").lower()
    category = request.args.get("category", "all").lower()

    venues_list = VENUES.get(destination_id, [])

    if category and category != "all":
        venues_list = [v for v in venues_list if v.get("category") == category]

    return jsonify(venues_list)

@app.route("/api/search", methods=["GET"])
def search_places():
    """
    Full text search endpoint across all destinations and venues.
    Query param: q=searchTerm
    """
    query = request.args.get("q", "").strip().lower()
    if not query:
        return jsonify({"destinations": [], "venues": []})

    matched_destinations = [
        d for d in DESTINATIONS 
        if query in d["name"].lower() or query in d["country"].lower() or query in d["tagline"].lower()
    ]

    matched_venues = []
    for dest_key, vlist in VENUES.items():
        for v in vlist:
            if (query in v["name"].lower() or 
                query in v["categoryLabel"].lower() or 
                query in v["address"].lower() or 
                query in v["description"].lower()):
                matched_venues.append(v)

    return jsonify({
        "query": query,
        "destinations": matched_destinations,
        "venues": matched_venues
    })

@app.route("/api/itinerary", methods=["POST"])
def generate_itinerary():
    """
    Generates a curated vacation itinerary for Ghana.
    JSON payload:
      - destination: destination name (e.g. 'Accra')
      - style: e.g. 'Beach & Nightlife', 'Cultural Explorer', 'Luxury & Wellness'
      - duration: number of days or '1 day'
    """
    data = request.get_json(silent=True) or {}
    dest_name = data.get("destination", "Accra")
    style = data.get("style", "Coastal & Cultural")

    gemini_key = os.environ.get("GEMINI_API_KEY")

    if gemini_key:
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            prompt = (
                f"Create a 1-day leisure travel itinerary for {dest_name}, Ghana focused on '{style}'. "
                f"Include 3-4 distinct time blocks (Morning, Lunch, Afternoon, Evening/Night) with recommended real spots in Ghana. "
                f"Format as valid JSON with keys: dayTitle, summary, items (list of {{time, title, description, venueName, category, tip}}), insiderTips (list of strings)."
            )
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={'response_mime_type': 'application/json'}
            )
            return jsonify(json.loads(response.text))
        except Exception as e:
            print(f"Gemini generation fallback: {e}")

    # Default Curated Itinerary Fallback
    fallback_itinerary = {
        "dayTitle": f"An Unforgettable Day in {dest_name}: {style}",
        "summary": f"A vibrant and authentic Ghana vacation experience taking you through premier beaches, local food, and lively cultural spots.",
        "items": [
            {
                "time": "09:00 AM",
                "title": "Morning Coastal Breeze & Breakfast",
                "description": f"Start your morning with freshly brewed Ghanaian coffee, tropical juices, and ocean views.",
                "venueName": "Somewhere Nice / Beachfront Cafe",
                "category": "hostels",
                "tip": "Arrive early to enjoy the cool Atlantic or Lake breeze."
            },
            {
                "time": "01:00 PM",
                "title": "Authentic Ghanaian Feast",
                "description": "Savor authentic charcoal grilled tilapia, jollof rice, plantain, and fresh coconut water.",
                "venueName": "Buka Restaurant / Local Chop Bar",
                "category": "restaurants",
                "tip": "Ask for mild shito pepper if you prefer subtle spice."
            },
            {
                "time": "04:30 PM",
                "title": "Sunset Shoreline Relaxation",
                "description": "Relax on sun loungers, watch local horseback riders, and listen to acoustic music by the water.",
                "venueName": "Labadi Pleasure Beach / Lake Bosomtwe",
                "category": "beaches",
                "tip": "Great time for golden hour photography."
            },
            {
                "time": "08:30 PM",
                "title": "Nightlife & Afrobeats Vibe",
                "description": "Experience the pulse of Ghana with handcrafted cocktails, live DJs, and open-air courtyard lounges.",
                "venueName": "Bloom Bar / Vienna City Lounge",
                "category": "nightlife",
                "tip": "Dress stylishly and immerse yourself in the Afrobeats rhythm."
            }
        ],
        "insiderTips": [
            "Use ride-hailing apps like Uber or Bolt for convenient city navigation.",
            "Always try the fresh coconut water directly from roadside vendors.",
            "Carry both Mobile Money (MoMo) and cash for local markets and beach entry."
        ]
    }

    return jsonify(fallback_itinerary)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
