import os
import json
import streamlit as st
import pandas as pd

# ---------------------------------------------------------
# Page Configuration
# ---------------------------------------------------------
st.set_page_config(
    page_title="VacationHub Ghana | Leisure & Travel Guide",
    page_icon="🌴",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------
# Custom Styling
# ---------------------------------------------------------
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        color: #e11d48;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    .place-card {
        background-color: #ffffff;
        border-radius: 16px;
        padding: 1.2rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        margin-bottom: 1rem;
    }
    .category-badge {
        background-color: #ffe4e6;
        color: #e11d48;
        font-weight: 700;
        font-size: 0.75rem;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
        display: inline-block;
    }
    .rating-badge {
        background-color: #fef3c7;
        color: #d97706;
        font-weight: 700;
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        border-radius: 8px;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# Destination & Venue Data
# ---------------------------------------------------------
DESTINATIONS = {
    "accra": {
        "id": "accra",
        "name": "Accra Capital & Atlantic Coast",
        "country": "Greater Accra, Ghana",
        "tagline": "Vibrant Atlantic coastlines, 5-star hotels, rooftop lounges, hostels & fine dining",
        "center": {"lat": 5.5560, "lng": -0.1969},
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    },
    "kumasi": {
        "id": "kumasi",
        "name": "Kumasi Garden City & Ashanti Hub",
        "country": "Ashanti Region, Ghana",
        "tagline": "Historic Ashanti heritage, crater lake beaches, luxury golf resorts, hostels & vibrant eateries",
        "center": {"lat": 6.6885, "lng": -1.6244},
        "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80"
    }
}

VENUES = {
    "accra": [
        {
            "id": "accra-h1",
            "name": "Somewhere Nice Hostel Osu",
            "category": "hostels",
            "categoryLabel": "Boutique Eco Hostel",
            "rating": 4.8,
            "reviews": 940,
            "price": "$",
            "lat": 5.5601,
            "lng": -0.1802,
            "address": "F732/2 Cotton St, Osu, Accra",
            "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
            "description": "Accra's top rated eco-friendly hostel featuring swimming pool, open air courtyard, shared dorms, private suites, and live music.",
            "amenities": "Swimming Pool, Free Wi-Fi, Bar & Cafe, Backpacker Tours"
        },
        {
            "id": "accra-ht1",
            "name": "Kempinski Hotel Gold Coast City",
            "category": "hotels",
            "categoryLabel": "5-Star Ultra Luxury Hotel",
            "rating": 4.9,
            "reviews": 3120,
            "price": "$$$$",
            "lat": 5.5529,
            "lng": -0.1969,
            "address": "Gamel Abdul Nasser Ave, Ridge, Accra",
            "image": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
            "description": "The landmark luxury hotel in West Africa with infinity pool, Resense Spa, executive suites, and fine dining.",
            "amenities": "Infinity Pool, Resense Spa, Fine Dining, Tennis Courts"
        },
        {
            "id": "accra-ht2",
            "name": "Labadi Beach Hotel",
            "category": "hotels",
            "categoryLabel": "5-Star Oceanfront Resort",
            "rating": 4.9,
            "reviews": 2890,
            "price": "$$$$",
            "lat": 5.5581,
            "lng": -0.1450,
            "address": "1 No 1 Labadi Bypass, La, Accra",
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            "description": "Ghana's premier beachfront resort with tropical gardens, lagoon pools, private Atlantic beach access, and health spa.",
            "amenities": "Private Beach, Lagoon Pool, Spa, Oceanfront Buffet"
        },
        {
            "id": "accra-b1",
            "name": "Labadi Pleasure Beach",
            "category": "beaches",
            "categoryLabel": "Atlantic Beach & Entertainment",
            "rating": 4.8,
            "reviews": 4210,
            "price": "$",
            "lat": 5.5562,
            "lng": -0.1472,
            "address": "Labadi Beach Road, La, Accra",
            "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            "description": "Accra's most famous sandy coastline featuring Atlantic waves, horseback riding, fresh coconut stands, and live music.",
            "amenities": "Horseback Riding, Coconut Kiosks, Beach Volleyball, Music"
        },
        {
            "id": "accra-r1",
            "name": "Buka Restaurant Osu",
            "category": "restaurants",
            "categoryLabel": "Authentic African & Seafood",
            "rating": 4.8,
            "reviews": 3210,
            "price": "$$",
            "lat": 5.5592,
            "lng": -0.1812,
            "address": "10th Lane, Osu, Accra",
            "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            "description": "Open-air wooden upper terrace serving iconic charcoal-grilled Atlantic tilapia, jollof rice, plantain, and pepper prawns.",
            "amenities": "Charcoal Tilapia, Jollof & Banku, Fresh Juices, Terrace"
        },
        {
            "id": "accra-n1",
            "name": "Bloom Bar Osu",
            "category": "nightlife",
            "categoryLabel": "Open-Air Cocktail Courtyard",
            "rating": 4.9,
            "reviews": 4500,
            "price": "$$",
            "lat": 5.5560,
            "lng": -0.1789,
            "address": "8 Fankanaa St, Osu, Accra",
            "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
            "description": "The epicenter of Accra nightlife with neon lights, signature cocktails, and live Afrobeats DJs.",
            "amenities": "Afrobeats DJs, Signature Cocktails, Courtyard Lounge"
        },
        {
            "id": "accra-m1",
            "name": "Accra Mall Tetteh Quarshie",
            "category": "malls",
            "categoryLabel": "Premier Shopping & Leisure Mall",
            "rating": 4.7,
            "reviews": 5200,
            "price": "$$",
            "lat": 5.6214,
            "lng": -0.1735,
            "address": "Tetteh Quarshie Interchange, Accra",
            "image": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80",
            "description": "Large shopping destination featuring Silverbird Cinemas, international fashion boutiques, and food court.",
            "amenities": "Multiplex Cinema, Food Court, International Retail, Parking"
        },
        {
            "id": "accra-pk1",
            "name": "Legon Botanical Gardens & Canopy Walk",
            "category": "parks",
            "categoryLabel": "Eco Park & Canopy Walkway",
            "rating": 4.8,
            "reviews": 3400,
            "price": "$",
            "lat": 5.6510,
            "lng": -0.1852,
            "address": "Agostinho Neto Rd, Legon, Accra",
            "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
            "description": "Lush sanctuary with aerial canopy walkways, canoeing lake, high ropes obstacle courses, and shaded picnic lawns.",
            "amenities": "Canopy Bridge, Canoeing Lake, High Ropes, Picnic Lawns"
        }
    ],
    "kumasi": [
        {
            "id": "ksi-h1",
            "name": "Kumasi Backpackers Heritage Hostel",
            "category": "hostels",
            "categoryLabel": "Cultural & Eco Hostel",
            "rating": 4.8,
            "reviews": 810,
            "price": "$",
            "lat": 6.6912,
            "lng": -1.6210,
            "address": "Adum Cultural Strip, Kumasi",
            "image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
            "description": "Central Kumasi backpacker lodge with Ashanti kente decor, courtyard garden, bike rentals, and Lake Bosomtwe tours.",
            "amenities": "Free Wi-Fi, Courtyard Cafe, Cultural Tours, Bike Rentals"
        },
        {
            "id": "ksi-ht1",
            "name": "Lancaster Kumasi Hotel (Golden Tulip)",
            "category": "hotels",
            "categoryLabel": "4-Star Luxury City Hotel",
            "rating": 4.8,
            "reviews": 2300,
            "price": "$$$$",
            "lat": 6.6850,
            "lng": -1.6320,
            "address": "Rain Tree Avenue, Nhyiaeso, Kumasi",
            "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            "description": "Kumasi's landmark luxury hotel with outdoor swimming pool, casino, piano lounge, and executive suites.",
            "amenities": "Outdoor Pool, Piano Bar, Casino, Tennis Court, Buffet"
        },
        {
            "id": "ksi-b1",
            "name": "Lake Bosomtwe Paradise Resort & Beach",
            "category": "beaches",
            "categoryLabel": "Crater Lake Shoreline Beach",
            "rating": 4.9,
            "reviews": 2950,
            "price": "$$",
            "lat": 6.5383,
            "lng": -1.4143,
            "address": "Abono Lake Shoreline, Lake Bosomtwe, Kumasi",
            "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
            "description": "Natural meteorite crater lake beach offering lake swimming, kayaking, boat rides, and fresh grilled tilapia.",
            "amenities": "Lake Kayaking, Boat Rides, Sunbeds, Tilapia Grill"
        },
        {
            "id": "ksi-r1",
            "name": "Kentish Kitchen & Fufu Spot Ahodwo",
            "category": "restaurants",
            "categoryLabel": "Famous Ashanti Fufu Joint",
            "rating": 4.9,
            "reviews": 3100,
            "price": "$",
            "lat": 6.6710,
            "lng": -1.6240,
            "address": "Ahodwo Roundabout, Kumasi",
            "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
            "description": "Kumasi's legendary home of authentic pounded cassava fufu with rich light soup, fresh goat meat, and bushmeat.",
            "amenities": "Fresh Pounded Fufu, Goat Light Soup, Outdoor Seating"
        },
        {
            "id": "ksi-m1",
            "name": "Kumasi City Mall Asokwa",
            "category": "malls",
            "categoryLabel": "Mega Shopping & Entertainment Center",
            "rating": 4.9,
            "reviews": 6100,
            "price": "$$",
            "lat": 6.6720,
            "lng": -1.6050,
            "address": "Lake Rd, Asokwa, Kumasi",
            "image": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80",
            "description": "West Africa's grand single-story mall with Watch & Dine Cinema, food courts, and international retail brands.",
            "amenities": "Watch & Dine Cinema, Food Court, Kid Zone, Retail Stores"
        },
        {
            "id": "ksi-pk1",
            "name": "Rattray Park Recreational Center",
            "category": "parks",
            "categoryLabel": "Dancing Fountain Park & Garden",
            "rating": 4.8,
            "reviews": 4200,
            "price": "$",
            "lat": 6.6870,
            "lng": -1.6350,
            "address": "Nhyiaeso Rd, Kumasi",
            "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
            "description": "Modern urban recreational park with musical dancing fountain light show, swimming pool, and leafy lawns.",
            "amenities": "Musical Dancing Fountain, Swimming Pool, Play Castle"
        }
    ]
}

# ---------------------------------------------------------
# Sidebar Controls
# ---------------------------------------------------------
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80", use_container_width=True)
    st.markdown("### 🇬🇭 VacationHub Ghana")
    st.caption("Discover top hostels, hotels, beaches, nightlife, & local food.")

    # Destination Selection
    dest_choice = st.selectbox(
        "📍 Select Ghana Region",
        options=["accra", "kumasi"],
        format_func=lambda x: "Accra & Atlantic Coast" if x == "accra" else "Kumasi & Ashanti Hub"
    )

    selected_dest = DESTINATIONS[dest_choice]

    # Category Filter
    category_filter = st.radio(
        "🏷️ Filter by Category",
        options=["all", "hostels", "hotels", "beaches", "restaurants", "nightlife", "malls", "parks"],
        format_func=lambda x: {
            "all": "✨ All Places",
            "hostels": "🏠 Hostels & Guesthouses",
            "hotels": "🏨 Hotels & Luxury",
            "beaches": "🌊 Beaches & Lakes",
            "restaurants": "🍽️ Restaurants & Eateries",
            "nightlife": "🍸 Nightlife & Lounges",
            "malls": "🛍️ Shopping & Malls",
            "parks": "🌳 Parks & Nature"
        }.get(x, x.title())
    )

    st.divider()

    # Search Bar
    search_term = st.text_input("🔍 Search places or keywords", placeholder="e.g. Osu, Beach, Fufu, Pool...")

# ---------------------------------------------------------
# Main Header
# ---------------------------------------------------------
col_h1, col_h2 = st.columns([3, 1])
with col_h1:
    st.markdown(f"<div class='main-header'>🌴 {selected_dest['name']}</div>", unsafe_allow_html=True)
    st.markdown(f"<div class='sub-header'>{selected_dest['tagline']}</div>", unsafe_allow_html=True)

# ---------------------------------------------------------
# Filter & Display Logic
# ---------------------------------------------------------
places_list = VENUES.get(dest_choice, [])

if category_filter != "all":
    places_list = [p for p in places_list if p["category"] == category_filter]

if search_term.strip():
    q = search_term.lower()
    places_list = [
        p for p in places_list
        if q in p["name"].lower() or q in p["description"].lower() or q in p["address"].lower() or q in p["categoryLabel"].lower()
    ]

# ---------------------------------------------------------
# Tabs: Explore Places, Interactive Map, AI Planner
# ---------------------------------------------------------
tab_explore, tab_map, tab_ai = st.tabs(["✨ Explore Places", "🗺️ Interactive Map", "🤖 AI Vacation Planner"])

with tab_explore:
    st.markdown(f"**Showing {len(places_list)} spots in {selected_dest['name']}**")
    
    if not places_list:
        st.info("No places found matching your search. Try resetting the search filter.")
    else:
        # Display in 2 columns
        cols = st.columns(2)
        for idx, place in enumerate(places_list):
            with cols[idx % 2]:
                with st.container():
                    st.image(place["image"], use_container_width=True)
                    st.markdown(f"### {place['name']}")
                    st.markdown(f"<span class='category-badge'>{place['categoryLabel']}</span> &nbsp; <span class='rating-badge'>★ {place['rating']} ({place['reviews']} reviews)</span> &nbsp; **{place['price']}**", unsafe_allow_html=True)
                    st.write(place["description"])
                    st.caption(f"📍 **Address:** {place['address']}")
                    st.caption(f"✨ **Amenities:** {place['amenities']}")
                    st.divider()

with tab_map:
    st.markdown(f"### Map View: {selected_dest['name']}")
    if places_list:
        df_map = pd.DataFrame([{"lat": p["lat"], "lon": p["lng"], "name": p["name"]} for p in places_list])
        st.map(df_map, zoom=11)
    else:
        st.info("No places to display on map.")

with tab_ai:
    st.markdown("### 🤖 Gemini AI Vacation & Day Planner")
    st.write("Generate a custom day-by-day vacation itinerary for Ghana.")

    ai_style = st.selectbox(
        "Select Travel Style",
        options=["Coastal Beaches & Nightlife", "Cultural Heritage & Food Explorer", "Luxury Relaxation & Spas", "Budget Backpacker & Adventure"]
    )

    if st.button("✨ Generate Ghana Itinerary", type="primary"):
        with st.spinner(f"Generating personalized itinerary for {selected_dest['name']}..."):
            gemini_key = os.environ.get("GEMINI_API_KEY")
            itinerary_text = ""
            
            if gemini_key:
                try:
                    from google import genai
                    client = genai.Client(api_key=gemini_key)
                    prompt = (
                        f"Create an exciting, detailed 1-day leisure itinerary for {selected_dest['name']}, Ghana with a focus on '{ai_style}'. "
                        f"Include morning, lunch, afternoon, and evening recommendations using authentic places in Ghana."
                    )
                    res = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
                    itinerary_text = res.text
                except Exception as e:
                    itinerary_text = ""

            if not itinerary_text:
                itinerary_text = f"""
### 🌟 1-Day Itinerary: {selected_dest['name']} ({ai_style})

**09:00 AM — Morning Fresh Start & Breakfast**
- Start at a scenic cafe or beachside lounge for local Ghanaian coffee, tropical mango/pineapple juice, and breakfast pastry.

**01:00 PM — Authentic Ghanaian Lunch Feast**
- Head to an authentic eatery like **Buka Restaurant** or **Kentish Kitchen** to savor authentic charcoal-grilled Atlantic tilapia with jollof rice, fried plantains (kelewele), or freshly pounded fufu with goat light soup.

**04:30 PM — Golden Hour & Scenic Shoreline**
- Relax by the waters of **Labadi Pleasure Beach** or **Lake Bosomtwe**, enjoy the cool breeze, watch local horseback riders, and capture sunset photography.

**08:30 PM — Evening Leisure & Afrobeats Vibe**
- Experience the pulse of nightlife at an open-air lounge like **Bloom Bar** or **Vienna City** with signature cocktails and vibrant Afrobeats music.

---
💡 **Insider Travel Tips for Ghana:**
- Use ride-hailing services (Uber/Bolt) for quick transit.
- Carry Mobile Money (MoMo) or cash for local markets and beach entry fees.
- Always try fresh coconut water straight from roadside fruit stands!
"""
            st.success("Itinerary Created Successfully!")
            st.markdown(itinerary_text)

# ---------------------------------------------------------
# Footer
# ---------------------------------------------------------
st.divider()
st.caption("VacationHub Ghana • Built with Python & Streamlit • Greater Accra & Ashanti Region Guide")
