/**
 * Service to map layout types to predefined images
 * This is much faster than generating images on-the-fly
 */

// Default layout images (used for most event types)
const DEFAULT_LAYOUT_IMAGES = {
  'layout1': '/layout-images/tech-fest/layout1.png',
  'layout2': '/layout-images/tech-fest/layout2.png',
  'layout3': '/layout-images/tech-fest/layout3.png',
};

// Birthday-specific layout images
const BIRTHDAY_LAYOUT_IMAGES = {
  'layout1': '/layout-images/birthday/layout1.png',
  'layout2': '/layout-images/birthday/layout2.png',
  'layout3': '/layout-images/birthday/layout3.png',
};

// Wedding-specific layout images
const WEDDING_LAYOUT_IMAGES = {
  'layout1': '/layout-images/wedding/layout1.png',
  'layout2': '/layout-images/wedding/layout2.png',
  'layout3': '/layout-images/wedding/layout3.png',
};

// Predefined layout images for different event types
const LAYOUT_IMAGE_MAPPINGS = {
  'tech': DEFAULT_LAYOUT_IMAGES,
  'tech fest': DEFAULT_LAYOUT_IMAGES,
  'tech conference': DEFAULT_LAYOUT_IMAGES,
  'hackathon': DEFAULT_LAYOUT_IMAGES,
  'conference': DEFAULT_LAYOUT_IMAGES,
  'seminar': DEFAULT_LAYOUT_IMAGES,
  'workshop': DEFAULT_LAYOUT_IMAGES,
  'wedding': WEDDING_LAYOUT_IMAGES,
  'marriage': WEDDING_LAYOUT_IMAGES,
  'reception': WEDDING_LAYOUT_IMAGES,
  'birthday': BIRTHDAY_LAYOUT_IMAGES,
  'party': BIRTHDAY_LAYOUT_IMAGES,
  'celebration': BIRTHDAY_LAYOUT_IMAGES,
  'corporate': DEFAULT_LAYOUT_IMAGES,
  'meeting': DEFAULT_LAYOUT_IMAGES,
  'default': DEFAULT_LAYOUT_IMAGES, // Fallback for any event type
};

// Keywords to match event types
const EVENT_TYPE_KEYWORDS = {
  'tech': ['tech', 'technology', 'hackathon', 'coding', 'developer', 'startup'],
  'conference': ['conference', 'seminar', 'workshop', 'symposium', 'summit'],
  'wedding': ['wedding', 'marriage', 'reception', 'ceremony'],
  'birthday': ['birthday', 'party', 'celebration', 'anniversary'],
  'corporate': ['corporate', 'business', 'meeting', 'networking', 'professional'],
};

/**
 * Get the event category from event type string
 * Now returns 'default' for all events to use the same images
 */
export const getEventCategory = (eventType) => {
  if (!eventType) return 'default';
  
  const lowerEventType = eventType.toLowerCase();
  
  // Check for exact matches first
  if (LAYOUT_IMAGE_MAPPINGS[lowerEventType]) {
    return lowerEventType;
  }
  
  // Check for keyword matches
  for (const [category, keywords] of Object.entries(EVENT_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => lowerEventType.includes(keyword))) {
      return category;
    }
  }
  
  // Always return 'default' to use the default images for any event type
  return 'default';
};

/**
 * Get predefined images for layouts based on event type
 * Now always returns images since we have default images for all events
 */
export const getLayoutImages = (layouts, eventType) => {
  const category = getEventCategory(eventType);
  const imageMapping = LAYOUT_IMAGE_MAPPINGS[category] || DEFAULT_LAYOUT_IMAGES;
  
  console.log(`✅ Using predefined images for event type: ${eventType} (category: ${category})`);
  
  return layouts.map((layout, index) => {
    const imageKey = `layout${index + 1}`;
    const imageUrl = imageMapping[imageKey];
    
    return {
      ...layout,
      imageUrl: imageUrl ? `http://localhost:5173${imageUrl}` : null,
      usePredefinedImage: !!imageUrl
    };
  });
};

/**
 * Check if predefined images exist for an event type
 */
export const hasPredefinedImages = (eventType) => {
  const category = getEventCategory(eventType);
  return !!LAYOUT_IMAGE_MAPPINGS[category];
};

/**
 * Get all available event categories with images
 */
export const getAvailableCategories = () => {
  return Object.keys(LAYOUT_IMAGE_MAPPINGS);
};

/**
 * Add new image mapping (for future expansion)
 */
export const addImageMapping = (eventType, layoutImages) => {
  LAYOUT_IMAGE_MAPPINGS[eventType.toLowerCase()] = layoutImages;
  console.log(`✅ Added image mapping for: ${eventType}`);
};
