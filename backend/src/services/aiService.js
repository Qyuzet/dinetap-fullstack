const { GoogleGenerativeAI } = require('@google/generative-ai');
const WebsiteAnalyzer = require('./websiteAnalyzer');
require('dotenv').config();

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found. AI features will use fallback responses.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }

    // Initialize website analyzer
    this.websiteAnalyzer = new WebsiteAnalyzer();
  }

  async generateRestaurantData(restaurantName, websiteUrl = null) {
    try {
      console.log(`Generating restaurant data with Gemini for: ${restaurantName}`);

      // Extract actual website colors if URL is provided
      let extractedColors = null;
      if (websiteUrl) {
        try {
          console.log(`🎨 Extracting colors from website: ${websiteUrl}`);
          extractedColors = await this.websiteAnalyzer.extractWebsiteColors(websiteUrl);
          if (extractedColors) {
            console.log(`✅ Successfully extracted colors:`, extractedColors);
          } else {
            console.log(`⚠️ Could not extract colors from website`);
          }
        } catch (colorError) {
          console.error('Error extracting website colors:', colorError);
        }
      }

      if (!this.genAI) {
        return this.getFallbackRestaurantData(restaurantName, extractedColors);
      }

      // Get the Gemini model
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      // Prepare the enhanced prompt with better color theory
      const prompt = `
Analyze and generate a restaurant portal design for "${restaurantName}".
${websiteUrl ? `Website URL: ${websiteUrl}` : ""}
${extractedColors ? `
EXTRACTED WEBSITE COLORS:
Primary: ${extractedColors.primary}
Secondary: ${extractedColors.secondary}
Accent: ${extractedColors.accent}
Additional colors found: ${extractedColors.extractedColors?.slice(0, 5).join(', ') || 'None'}

IMPORTANT: Use these extracted colors as the foundation for the color scheme. These are the actual brand colors from the restaurant's website. Adapt them if needed for better contrast or food presentation, but stay true to the brand identity.` : ""}

IMPORTANT: Create a professional, brand-appropriate color scheme that:
1. Reflects the restaurant's cuisine type and atmosphere
2. Has excellent contrast ratios (WCAG AA compliant)
3. Uses color psychology appropriate for food/dining
4. Avoids clashing or overly saturated colors
5. Creates a cohesive, appetizing visual experience

Consider these factors for color selection:
- Restaurant type (fine dining, casual, fast food, ethnic cuisine, etc.)
- Target audience and atmosphere
- Food photography compatibility (colors that make food look appealing)
- Brand personality (modern, traditional, rustic, elegant, etc.)
- Accessibility and readability

CUISINE-SPECIFIC COLOR GUIDELINES:
- Italian: Warm reds, greens, creams (avoid garish combinations)
- Asian: Deep reds, golds, blacks, or clean whites with accent colors
- Mexican: Warm terracottas, deep blues, rich oranges (not neon)
- Mediterranean: Ocean blues, olive greens, warm whites
- American: Classic blues, reds, or modern neutrals
- Fine Dining: Sophisticated blacks, golds, deep blues, or elegant neutrals
- Casual: Warm, inviting colors with good contrast

Generate:
1. Restaurant description (2-3 sentences)
2. Professional color scheme with proper contrast
3. Menu items (8-10 items across categories)

JSON format:
{
  "description": "Brief restaurant description",
  "cuisineType": "cuisine category",
  "atmosphere": "dining atmosphere (casual/fine/fast/etc)",
  "colors": {
    "primary": "#hexcolor (main brand color - should be professional)",
    "secondary": "#hexcolor (darker shade for text/accents - ensure contrast)",
    "accent": "#hexcolor (light background/highlight color - subtle)"
  },
  "colorRationale": "Brief explanation of color choices",
  "menuItems": [...]
}

CRITICAL: Ensure colors work well together and create an appetizing, professional appearance.
`;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Could not extract JSON from response");
        }
        
        const jsonStr = jsonMatch[0];
        const data = JSON.parse(jsonStr);
        
        // Validate and enhance the data
        const enhancedData = this.enhanceGeneratedData(data, restaurantName, extractedColors);

        return {
          success: true,
          data: enhancedData
        };
      } catch (jsonError) {
        console.error("Error parsing Gemini response as JSON:", jsonError);
        return this.getFallbackRestaurantData(restaurantName, extractedColors);
      }
    } catch (error) {
      console.error("Error generating restaurant data with Gemini:", error);
      return this.getFallbackRestaurantData(restaurantName, extractedColors);
    }
  }

  enhanceGeneratedData(data, restaurantName, extractedColors = null) {
    // Prioritize extracted website colors over AI-generated ones
    let colors = data.colors;

    if (extractedColors) {
      console.log("🎨 Using extracted website colors as primary source");
      colors = {
        primary: extractedColors.primary,
        secondary: extractedColors.secondary,
        accent: extractedColors.accent
      };
    } else if (!colors || !colors.primary || !colors.secondary || !colors.accent) {
      console.log("AI didn't provide complete color scheme, using smart fallback");
      colors = this.generateSmartColorScheme(
        restaurantName,
        data.cuisineType,
        data.atmosphere
      );
    } else {
      // Validate hex color format
      const hexRegex = /^#[0-9A-F]{6}$/i;
      if (!hexRegex.test(colors.primary) || !hexRegex.test(colors.secondary) || !hexRegex.test(colors.accent)) {
        console.log("AI provided invalid color format, using smart fallback");
        colors = this.generateSmartColorScheme(
          restaurantName,
          data.cuisineType,
          data.atmosphere
        );
      }
    }

    // Validate and improve colors for contrast
    colors = this.validateAndImproveColors(colors, restaurantName);

    // Ensure all required fields are present
    const enhanced = {
      description: data.description || `${restaurantName} is a welcoming restaurant offering delicious food in a comfortable atmosphere.`,
      cuisineType: data.cuisineType || "Restaurant",
      atmosphere: data.atmosphere || "Casual",
      colors: colors,
      colorRationale: data.colorRationale || "Professional color scheme selected for optimal dining experience",
      menuItems: []
    };

    // Process menu items
    if (data.menuItems && Array.isArray(data.menuItems)) {
      enhanced.menuItems = data.menuItems.map(item => ({
        name: item.name || "Menu Item",
        description: item.description || "Delicious menu item",
        price: typeof item.price === 'number' ? item.price : 12.99,
        category: item.category || "Main Courses",
        tags: Array.isArray(item.tags) ? item.tags : [],
        available: item.available !== undefined ? item.available : true
      }));
    }

    // If no menu items generated, add fallback items
    if (enhanced.menuItems.length === 0) {
      enhanced.menuItems = this.getFallbackMenuItems();
    }

    return enhanced;
  }

  getFallbackRestaurantData(restaurantName, extractedColors = null) {
    console.log("Using fallback restaurant data with smart color scheme");

    // Use extracted colors if available, otherwise smart color scheme
    let colors;
    if (extractedColors) {
      console.log("🎨 Using extracted website colors in fallback");
      colors = {
        primary: extractedColors.primary,
        secondary: extractedColors.secondary,
        accent: extractedColors.accent
      };
    } else {
      colors = this.generateSmartColorScheme(restaurantName);
    }

    return {
      success: true,
      data: {
        description: `${restaurantName} is a welcoming restaurant offering delicious food in a comfortable atmosphere. The menu features a variety of dishes made with fresh, quality ingredients.`,
        cuisineType: "Restaurant",
        atmosphere: "Casual",
        colors: colors,
        colorRationale: extractedColors ? "Colors extracted from restaurant website" : "Smart color scheme selected based on restaurant characteristics",
        menuItems: this.getFallbackMenuItems()
      }
    };
  }

  getFallbackMenuItems() {
    return [
      {
        name: "House Salad",
        description: "Fresh mixed greens with house dressing",
        price: 8.99,
        category: "Appetizers",
        tags: ["vegetarian", "fresh"],
        available: true
      },
      {
        name: "Signature Pasta",
        description: "Handmade pasta with chef's special sauce",
        price: 16.99,
        category: "Main Courses",
        tags: ["popular"],
        available: true
      },
      {
        name: "Grilled Chicken",
        description: "Tender grilled chicken breast with seasonal vegetables",
        price: 18.99,
        category: "Main Courses",
        tags: ["protein", "healthy"],
        available: true
      },
      {
        name: "Chocolate Dessert",
        description: "Rich chocolate dessert with vanilla ice cream",
        price: 7.99,
        category: "Desserts",
        tags: ["sweet", "chocolate"],
        available: true
      },
      {
        name: "Fresh Juice",
        description: "Freshly squeezed orange juice",
        price: 4.99,
        category: "Drinks",
        tags: ["fresh", "healthy"],
        available: true
      }
    ];
  }

  generateRandomColorScheme() {
    // Professional, restaurant-appropriate color schemes with proper contrast
    const colorSchemes = [
      // Elegant Fine Dining
      { primary: "#1F2937", secondary: "#111827", accent: "#F9FAFB", name: "Elegant Dark" },
      { primary: "#B91C1C", secondary: "#7F1D1D", accent: "#FEF2F2", name: "Classic Red" },
      { primary: "#1E40AF", secondary: "#1E3A8A", accent: "#EFF6FF", name: "Professional Blue" },

      // Warm & Inviting
      { primary: "#D97706", secondary: "#92400E", accent: "#FFFBEB", name: "Warm Amber" },
      { primary: "#DC2626", secondary: "#991B1B", accent: "#FEF2F2", name: "Appetizing Red" },
      { primary: "#059669", secondary: "#047857", accent: "#ECFDF5", name: "Fresh Green" },

      // Modern & Clean
      { primary: "#374151", secondary: "#1F2937", accent: "#F9FAFB", name: "Modern Gray" },
      { primary: "#7C3AED", secondary: "#5B21B6", accent: "#F5F3FF", name: "Modern Purple" },
      { primary: "#0F766E", secondary: "#134E4A", accent: "#F0FDFA", name: "Sophisticated Teal" },

      // Mediterranean & International
      { primary: "#1D4ED8", secondary: "#1E3A8A", accent: "#EFF6FF", name: "Mediterranean Blue" },
      { primary: "#EA580C", secondary: "#C2410C", accent: "#FFF7ED", name: "Terracotta" },
      { primary: "#16A34A", secondary: "#15803D", accent: "#F0FDF4", name: "Olive Green" },

      // Sophisticated Neutrals
      { primary: "#57534E", secondary: "#44403C", accent: "#FAFAF9", name: "Warm Stone" },
      { primary: "#0F172A", secondary: "#020617", accent: "#F8FAFC", name: "Midnight" },
      { primary: "#92400E", secondary: "#78350F", accent: "#FFFBEB", name: "Rich Brown" }
    ];

    const selected = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    console.log(`Selected fallback color scheme: ${selected.name}`);

    return {
      primary: selected.primary,
      secondary: selected.secondary,
      accent: selected.accent
    };
  }

  // Smart color scheme generator based on restaurant name and type
  generateSmartColorScheme(restaurantName, cuisineType = null, atmosphere = null) {
    const name = restaurantName.toLowerCase();

    // Cuisine-based color schemes
    const cuisineSchemes = {
      italian: [
        { primary: "#DC2626", secondary: "#991B1B", accent: "#FEF2F2" }, // Classic red
        { primary: "#16A34A", secondary: "#15803D", accent: "#F0FDF4" }, // Italian green
        { primary: "#D97706", secondary: "#92400E", accent: "#FFFBEB" }  // Warm gold
      ],
      asian: [
        { primary: "#DC2626", secondary: "#7F1D1D", accent: "#FEF2F2" }, // Lucky red
        { primary: "#1F2937", secondary: "#111827", accent: "#F9FAFB" }, // Elegant black
        { primary: "#D97706", secondary: "#92400E", accent: "#FFFBEB" }  // Gold
      ],
      mexican: [
        { primary: "#EA580C", secondary: "#C2410C", accent: "#FFF7ED" }, // Terracotta
        { primary: "#1D4ED8", secondary: "#1E3A8A", accent: "#EFF6FF" }, // Deep blue
        { primary: "#DC2626", secondary: "#991B1B", accent: "#FEF2F2" }  // Warm red
      ],
      mediterranean: [
        { primary: "#1D4ED8", secondary: "#1E3A8A", accent: "#EFF6FF" }, // Ocean blue
        { primary: "#16A34A", secondary: "#15803D", accent: "#F0FDF4" }, // Olive green
        { primary: "#0F766E", secondary: "#134E4A", accent: "#F0FDFA" }  // Teal
      ],
      american: [
        { primary: "#1E40AF", secondary: "#1E3A8A", accent: "#EFF6FF" }, // Classic blue
        { primary: "#DC2626", secondary: "#991B1B", accent: "#FEF2F2" }, // American red
        { primary: "#374151", secondary: "#1F2937", accent: "#F9FAFB" }  // Modern gray
      ],
      french: [
        { primary: "#1F2937", secondary: "#111827", accent: "#F9FAFB" }, // Elegant black
        { primary: "#7C3AED", secondary: "#5B21B6", accent: "#F5F3FF" }, // Royal purple
        { primary: "#92400E", secondary: "#78350F", accent: "#FFFBEB" }  // Rich brown
      ]
    };

    // Atmosphere-based adjustments
    const atmosphereSchemes = {
      fine: [
        { primary: "#1F2937", secondary: "#111827", accent: "#F9FAFB" }, // Sophisticated black
        { primary: "#0F172A", secondary: "#020617", accent: "#F8FAFC" }, // Midnight
        { primary: "#57534E", secondary: "#44403C", accent: "#FAFAF9" }  // Warm stone
      ],
      casual: [
        { primary: "#D97706", secondary: "#92400E", accent: "#FFFBEB" }, // Warm amber
        { primary: "#059669", secondary: "#047857", accent: "#ECFDF5" }, // Fresh green
        { primary: "#1E40AF", secondary: "#1E3A8A", accent: "#EFF6FF" }  // Friendly blue
      ],
      fast: [
        { primary: "#DC2626", secondary: "#991B1B", accent: "#FEF2F2" }, // Energetic red
        { primary: "#D97706", secondary: "#92400E", accent: "#FFFBEB" }, // Fast amber
        { primary: "#16A34A", secondary: "#15803D", accent: "#F0FDF4" }  // Fresh green
      ]
    };

    // Keyword-based detection
    let detectedSchemes = [];

    // Check for cuisine keywords in name
    if (name.includes('pizza') || name.includes('italian') || name.includes('pasta')) {
      detectedSchemes = cuisineSchemes.italian;
    } else if (name.includes('sushi') || name.includes('asian') || name.includes('chinese') || name.includes('thai')) {
      detectedSchemes = cuisineSchemes.asian;
    } else if (name.includes('mexican') || name.includes('taco') || name.includes('burrito')) {
      detectedSchemes = cuisineSchemes.mexican;
    } else if (name.includes('mediterranean') || name.includes('greek')) {
      detectedSchemes = cuisineSchemes.mediterranean;
    } else if (name.includes('french') || name.includes('bistro')) {
      detectedSchemes = cuisineSchemes.french;
    } else if (cuisineType && cuisineSchemes[cuisineType.toLowerCase()]) {
      detectedSchemes = cuisineSchemes[cuisineType.toLowerCase()];
    }

    // Check for atmosphere keywords
    if (name.includes('fine') || name.includes('elegant') || name.includes('upscale')) {
      detectedSchemes = atmosphereSchemes.fine;
    } else if (name.includes('fast') || name.includes('quick') || name.includes('express')) {
      detectedSchemes = atmosphereSchemes.fast;
    } else if (atmosphere && atmosphereSchemes[atmosphere.toLowerCase()]) {
      detectedSchemes = atmosphereSchemes[atmosphere.toLowerCase()];
    }

    // If we detected specific schemes, use them; otherwise use general fallback
    if (detectedSchemes.length > 0) {
      const selected = detectedSchemes[Math.floor(Math.random() * detectedSchemes.length)];
      console.log(`Selected smart color scheme for ${restaurantName} based on detected characteristics`);
      return selected;
    }

    // Fallback to general restaurant schemes
    return this.generateRandomColorScheme();
  }

  // Color contrast validation (WCAG AA compliance)
  validateColorContrast(color1, color2) {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    // Calculate relative luminance
    const getLuminance = (rgb) => {
      const { r, g, b } = rgb;
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    // Calculate contrast ratio
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return false;

    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    const contrast = (brightest + 0.05) / (darkest + 0.05);

    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    return contrast >= 4.5;
  }

  // Validate and improve color scheme
  validateAndImproveColors(colors, restaurantName) {
    // Check if primary and accent have good contrast
    if (!this.validateColorContrast(colors.primary, colors.accent)) {
      console.log(`Poor contrast detected for ${restaurantName}, adjusting colors`);

      // If contrast is poor, regenerate with a different scheme
      return this.generateSmartColorScheme(restaurantName);
    }

    return colors;
  }

  async generateMenuItemSuggestions(category, existingItems = []) {
    try {
      if (!this.genAI) {
        return this.getFallbackMenuSuggestions(category);
      }

      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const existingItemNames = existingItems.map(item => item.name).join(', ');
      
      const prompt = `
Generate 3-5 new menu items for the "${category}" category.
${existingItemNames ? `Avoid these existing items: ${existingItemNames}` : ''}

Format as JSON array:
[
  {
    "name": "Item name",
    "description": "Item description",
    "price": 12.99,
    "tags": ["tag1", "tag2"]
  }
]
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return { success: true, data: suggestions };
      }
      
      return this.getFallbackMenuSuggestions(category);
    } catch (error) {
      console.error("Error generating menu suggestions:", error);
      return this.getFallbackMenuSuggestions(category);
    }
  }

  getFallbackMenuSuggestions(category) {
    const suggestions = {
      "Appetizers": [
        { name: "Bruschetta", description: "Toasted bread with tomatoes and basil", price: 8.99, tags: ["vegetarian"] },
        { name: "Calamari Rings", description: "Crispy fried squid rings", price: 12.99, tags: ["seafood"] }
      ],
      "Main Courses": [
        { name: "Beef Steak", description: "Grilled beef steak with herbs", price: 24.99, tags: ["protein"] },
        { name: "Salmon Fillet", description: "Pan-seared salmon with lemon", price: 22.99, tags: ["seafood", "healthy"] }
      ],
      "Desserts": [
        { name: "Tiramisu", description: "Classic Italian dessert", price: 7.99, tags: ["sweet", "coffee"] },
        { name: "Ice Cream", description: "Vanilla ice cream with toppings", price: 5.99, tags: ["sweet", "cold"] }
      ],
      "Drinks": [
        { name: "Iced Coffee", description: "Cold brew coffee with ice", price: 4.99, tags: ["coffee", "cold"] },
        { name: "Smoothie", description: "Fresh fruit smoothie", price: 6.99, tags: ["healthy", "fresh"] }
      ]
    };

    return {
      success: true,
      data: suggestions[category] || suggestions["Main Courses"]
    };
  }

  async generateChatResponse(messages, portalId = null, menuItems = []) {
    try {
      console.log(`Generating chat response with Gemini`);

      if (!this.genAI) {
        return this.getFallbackChatResponse(messages);
      }

      // Get the Gemini model
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      // Create a context about the restaurant and its menu
      let systemPrompt = "You are a helpful AI assistant for a restaurant. Your name is Dinetap AI. ";

      // Add menu information to the context if available
      if (menuItems && menuItems.length > 0) {
        systemPrompt += "Here is our current menu: \n";
        menuItems.forEach((item) => {
          if (item && item.name && item.price !== undefined) {
            const price = typeof item.price === "number" ? item.price.toFixed(2) : item.price;
            systemPrompt += `- ${item.name}: ${item.description || "No description available"}. Price: $${price}. Category: ${item.category || "General"}.\n`;
          }
        });
        systemPrompt += "\nPlease help customers with questions about our menu, ingredients, recommendations, or any other restaurant-related inquiries. Keep responses brief and helpful.";
      } else {
        systemPrompt += "Please help customers with their questions about our restaurant. Keep responses brief and helpful.";
      }

      // Prepare the chat history
      const history = [];

      // Add previous messages to history (skip the last one which is the current user message)
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        if (msg.role === "user") {
          history.push({
            role: "user",
            parts: [{ text: msg.content }],
          });
        } else if (msg.role === "assistant") {
          history.push({
            role: "model",
            parts: [{ text: msg.content }],
          });
        }
      }

      // Start a chat session with the system prompt
      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topK: 40,
          topP: 0.95,
        },
      });

      // Send the system prompt first if this is the first message
      if (messages.length <= 2) {
        await chat.sendMessage(systemPrompt);
      }

      // Get the last user message
      const lastUserMessage = messages[messages.length - 1].content;
      console.log("Sending user message to Gemini:", lastUserMessage);

      // Generate a response with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 20000)
      );

      const responsePromise = chat.sendMessage(lastUserMessage);

      // Race between the API call and the timeout
      const result = await Promise.race([responsePromise, timeoutPromise]);
      const response = await result.response;
      const text = response.text();

      console.log("Received response from Gemini");

      return {
        success: true,
        data: { response: text }
      };
    } catch (error) {
      console.error("Error generating chat response with Gemini:", error);
      return this.getFallbackChatResponse(messages);
    }
  }

  getFallbackChatResponse(messages) {
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content.toLowerCase();

    let response = "I'm here to help! ";

    if (userMessage.includes('menu') || userMessage.includes('food') || userMessage.includes('dish')) {
      response += "I'd be happy to help you with our menu. What type of food are you interested in?";
    } else if (userMessage.includes('price') || userMessage.includes('cost')) {
      response += "Our menu items are reasonably priced. Would you like to know about specific dishes?";
    } else if (userMessage.includes('recommend') || userMessage.includes('suggest')) {
      response += "I'd recommend trying our signature dishes! They're very popular with our customers.";
    } else if (userMessage.includes('hours') || userMessage.includes('open')) {
      response += "Please check with the restaurant for current operating hours.";
    } else if (userMessage.includes('location') || userMessage.includes('address')) {
      response += "Please contact the restaurant directly for location and contact information.";
    } else {
      response += "How can I assist you with your dining experience today?";
    }

    return {
      success: true,
      data: { response }
    };
  }
}

module.exports = new AIService();
