import { GoogleGenAI } from '@google/genai';
import { AIItineraryResponse } from '../types';

export async function generateVacationItinerary(
  destinationName: string,
  userPreferences: string,
  vibe: string = 'Relaxing & Luxurious'
): Promise<AIItineraryResponse> {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    // Return curated high quality Ghana fallback
    return getFallbackItinerary(destinationName, vibe);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert luxury travel concierge for Vacation Hub in Ghana (${destinationName}).
    The guest wants a perfect 1-day leisure itinerary focusing strictly on fun, relaxation, dining, beach/outdoor activities, and entertainment in Ghana.
    Strict rule: NEVER mention schools, banks, offices, or hospitals.
    Guest Preferences: "${userPreferences}". Desired Vibe: "${vibe}".
    
    Return a JSON object with this exact structure:
    {
      "dayTitle": "Perfect Day in ${destinationName}",
      "summary": "Brief inspiring overview of the day in Ghana",
      "items": [
        {
          "time": "08:30 AM",
          "title": "Breakfast spot or oceanfront activity",
          "description": "Details about what to do and enjoy in Ghana",
          "venueName": "Suggested real or vibrant leisure spot in Ghana",
          "category": "restaurants",
          "tip": "Insider tip for guests"
        }
      ],
      "insiderTips": [
        "Useful insider secret 1",
        "Useful insider secret 2"
      ]
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return parsed as AIItineraryResponse;
    }
  } catch (err) {
    console.warn('Gemini API call error, using curated fallback:', err);
  }

  return getFallbackItinerary(destinationName, vibe);
}

function getFallbackItinerary(destinationName: string, vibe: string): AIItineraryResponse {
  return {
    dayTitle: `Tropical Bliss Day in ${destinationName}, Ghana`,
    summary: `A curated ${vibe.toLowerCase()} journey crafted for ultimate relaxation, Atlantic ocean views, fresh grilled seafood, and vibrant Ghanaian hospitality.`,
    items: [
      {
        time: '08:30 AM',
        title: 'Coastal Artisan Coffee & Fresh Fruit Breakfast',
        description: 'Start your morning with freshly brewed Ghanaian robusta coffee, sweet pineapple, papaya, and warm pastries on an ocean-view terrace.',
        venueName: 'Labadi Beach Hotel Garden Terrace',
        category: 'restaurants',
        tip: 'Order fresh coconut water tapped right at your table.'
      },
      {
        time: '10:30 AM',
        title: 'Atlantic Shoreline & Beach Lounge',
        description: 'Dip into Atlantic waters, relax in shaded beach cabanas, or take a sunset horse ride along the golden sand.',
        venueName: 'Labadi Pleasure Beach Club',
        category: 'beaches',
        tip: 'Fresh coconut kiosks and beach towel services are situated near the main walkway.'
      },
      {
        time: '01:00 PM',
        title: 'Charcoal-Grilled Tilapia & Banku Seafood Lunch',
        description: 'Savor legendary spicy charcoal-grilled Atlantic tilapia served with hot pepper sauce, banku, and grilled garlic butter lobster.',
        venueName: 'Buka Restaurant & Grill',
        category: 'seafood',
        tip: 'Pair your meal with a chilled palm wine cocktail or local craft brew.'
      },
      {
        time: '04:00 PM',
        title: 'Tropical Garden Promenade & Artisan Crafts',
        description: 'Stroll through palm-lined botanical gardens, browse handmade wood carvings, kente fabrics, and art galleries.',
        venueName: 'Legon Botanical Gardens',
        category: 'parks',
        tip: 'Try the aerial canopy walkway for panoramic views over the lush tree canopy.'
      },
      {
        time: '07:30 PM',
        title: 'Sunset Open-Air Afrobeats Cocktail Lounge',
        description: 'Unwind under the stars with handcrafted hibiscus cocktails, live Afrobeats lounge music, and open courtyard fire pits.',
        venueName: 'Bloom Bar Osu',
        category: 'nightlife',
        tip: 'Reserve a courtyard table by 7:00 PM for golden hour lighting and live acoustic sets.'
      }
    ],
    insiderTips: [
      'Cash and Mobile Money (MoMo) are widely used alongside cards at beach shacks.',
      'Always try fresh coconut water from beachside vendors for ultimate refreshment.',
      'Sunset peak hours along the coast are 6:00 PM - 7:15 PM; secure seaside lounge seats early.'
    ]
  };
}
