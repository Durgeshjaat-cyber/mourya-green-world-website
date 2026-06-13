export interface ProductCare {
  sunlight: string;
  water: string;
  growth: string;
  benefits: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  description: string;
  careTips: ProductCare;
  inStock: boolean;
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestseller: boolean;
  image: string;
}

export const categories = [
  "Indoor Plants",
  "Outdoor Plants",
  "Air Purifying Plants",
  "Lucky Plants",
  "Flowering Plants",
  "Succulents",
  "Hanging Plants",
  "Bonsai Plants",
  "Pots & Planters"
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Money Plant",
    price: 149,
    originalPrice: 199,
    category: "Indoor Plants",
    description: "A popular indoor climbing plant known for its heart-shaped green leaves. It is believed to bring wealth and good luck to the home.",
    careTips: {
      sunlight: "Bright indirect light to low light",
      water: "Water when the top inch of soil feels dry",
      growth: "Fast growing, trailing or climbing vine",
      benefits: ["Air purifying", "Easy to grow", "Brings positive energy"]
    },
    inStock: true,
    rating: 4.8,
    reviews: 124,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-1.png"
  },
  {
    id: "p2",
    name: "Snake Plant",
    price: 299,
    originalPrice: 399,
    category: "Air Purifying Plants",
    description: "An incredibly hardy plant with striking upright leaves. Excellent for beginners and one of the best air-purifying plants available.",
    careTips: {
      sunlight: "Low to bright indirect light",
      water: "Water every 2-3 weeks, allowing soil to dry out completely",
      growth: "Slow to moderate vertical growth",
      benefits: ["Releases oxygen at night", "Extremely low maintenance", "Filters indoor toxins"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 89,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-2.png"
  },
  {
    id: "p3",
    name: "Syngonium",
    price: 199,
    originalPrice: 249,
    category: "Indoor Plants",
    description: "A beautiful arrowhead vine featuring delicate leaves with soft pink and green hues. Perfect for adding a pop of color to any room.",
    careTips: {
      sunlight: "Medium to bright indirect light",
      water: "Keep soil slightly moist, water when top half inch is dry",
      growth: "Moderate, bushy growth",
      benefits: ["Beautiful foliage", "Improves humidity", "Compact size"]
    },
    inStock: true,
    rating: 4.5,
    reviews: 56,
    isNew: true,
    isBestseller: false,
    image: "/images/products/plant-3.png"
  },
  {
    id: "p4",
    name: "Monstera Deliciosa",
    price: 599,
    originalPrice: 799,
    category: "Indoor Plants",
    description: "The famous 'Swiss Cheese Plant' known for its massive, iconic split leaves. A stunning statement piece for modern interior spaces.",
    careTips: {
      sunlight: "Bright indirect light",
      water: "Water every 1-2 weeks, let soil dry halfway",
      growth: "Fast growing with proper support",
      benefits: ["Statement piece", "Tropical vibe", "Large air-filtering leaves"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 210,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-4.png"
  },
  {
    id: "p5",
    name: "Lucky Bamboo (3-layer)",
    price: 249,
    originalPrice: 299,
    category: "Lucky Plants",
    description: "A symbol of good fortune and prosperity in Feng Shui. This 3-layer arrangement brings positive energy to homes and offices.",
    careTips: {
      sunlight: "Low to medium indirect light",
      water: "Keep roots submerged in water, change water weekly",
      growth: "Slow growing",
      benefits: ["Attracts prosperity", "Can grow in water", "Perfect for desks"]
    },
    inStock: true,
    rating: 4.7,
    reviews: 145,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-5.png"
  },
  {
    id: "p6",
    name: "Peace Lily",
    price: 349,
    originalPrice: 449,
    category: "Air Purifying Plants",
    description: "An elegant plant with dark green foliage and beautiful white hooded flowers. Known for its exceptional air-purifying qualities.",
    careTips: {
      sunlight: "Medium indirect light, avoids direct sun",
      water: "Keep soil consistently moist, droops when thirsty",
      growth: "Moderate growth, blooms periodically",
      benefits: ["Beautiful white blooms", "Removes mold spores", "High transpiration rate"]
    },
    inStock: true,
    rating: 4.6,
    reviews: 92,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-6.png"
  },
  {
    id: "p7",
    name: "Jade Plant",
    price: 199,
    originalPrice: 259,
    category: "Succulents",
    description: "A popular succulent with thick, fleshy green leaves. Often called the 'Money Plant', it represents wealth and financial success.",
    careTips: {
      sunlight: "Bright indirect light to some direct sun",
      water: "Water sparingly, let soil dry completely between waterings",
      growth: "Slow growing, tree-like structure",
      benefits: ["Long-lasting", "Drought tolerant", "Good luck symbol"]
    },
    inStock: true,
    rating: 4.8,
    reviews: 78,
    isNew: false,
    isBestseller: false,
    image: "/images/products/plant-7.png"
  },
  {
    id: "p8",
    name: "Areca Palm",
    price: 499,
    originalPrice: 699,
    category: "Air Purifying Plants",
    description: "A lush, feathery palm that brings a tropical feel indoors. One of the top-rated plants for removing indoor air toxins.",
    careTips: {
      sunlight: "Bright indirect light",
      water: "Water when the top inch of soil is dry, keep slightly moist",
      growth: "Moderate to fast growing",
      benefits: ["Natural humidifier", "Pet friendly", "Excellent air purifier"]
    },
    inStock: true,
    rating: 4.7,
    reviews: 112,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-8.png"
  },
  {
    id: "p9",
    name: "Tulsi Plant",
    price: 99,
    originalPrice: 129,
    category: "Outdoor Plants",
    description: "Holy Basil is a sacred plant in India, revered for its spiritual significance and extensive medicinal properties.",
    careTips: {
      sunlight: "Full sun to partial shade (4-6 hours direct sun)",
      water: "Water daily in summer, keep soil moist but not waterlogged",
      growth: "Fast growing shrub",
      benefits: ["Spiritual significance", "Medicinal uses", "Mosquito repellent"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 340,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-9.png"
  },
  {
    id: "p10",
    name: "Pothos Golden",
    price: 129,
    originalPrice: 179,
    category: "Hanging Plants",
    description: "A classic trailing vine with beautiful golden-yellow variegation on green leaves. Nearly indestructible and perfect for hanging baskets.",
    careTips: {
      sunlight: "Low to bright indirect light",
      water: "Water when top 2 inches of soil are dry",
      growth: "Fast growing trailing vine",
      benefits: ["Extremely hardy", "Beautiful variegation", "Air purifying"]
    },
    inStock: true,
    rating: 4.8,
    reviews: 156,
    isNew: false,
    isBestseller: false,
    image: "/images/products/plant-1.png"
  },
  {
    id: "p11",
    name: "Spider Plant",
    price: 179,
    originalPrice: 229,
    category: "Hanging Plants",
    description: "An adaptable houseplant with long, ribbon-like leaves. It produces 'spiderettes' that cascade down, making it ideal for hanging.",
    careTips: {
      sunlight: "Bright indirect light",
      water: "Water moderately, let top soil dry between waterings",
      growth: "Fast growing, produces offsets",
      benefits: ["Pet friendly", "Removes formaldehyde", "Easy to propagate"]
    },
    inStock: true,
    rating: 4.6,
    reviews: 84,
    isNew: false,
    isBestseller: false,
    image: "/images/products/plant-2.png"
  },
  {
    id: "p12",
    name: "Aloe Vera",
    price: 149,
    originalPrice: 199,
    category: "Succulents",
    description: "A well-known medicinal succulent with thick, sap-filled leaves. Essential for every home for natural skin care and air purification.",
    careTips: {
      sunlight: "Bright indirect to direct sunlight",
      water: "Water deeply but infrequently, let soil dry completely",
      growth: "Moderate growth, produces pups",
      benefits: ["Healing gel inside", "Releases oxygen at night", "Very low maintenance"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 215,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-7.png"
  },
  {
    id: "p13",
    name: "Boston Fern",
    price: 249,
    originalPrice: 329,
    category: "Hanging Plants",
    description: "A lush, classic fern with elegant arching fronds. Adds a soft, textured look to indoor spaces and loves high humidity.",
    careTips: {
      sunlight: "Medium indirect light",
      water: "Keep soil constantly moist, mist regularly",
      growth: "Moderate, spreading growth",
      benefits: ["Excellent humidifier", "Non-toxic to pets", "Lush foliage"]
    },
    inStock: true,
    rating: 4.4,
    reviews: 67,
    isNew: false,
    isBestseller: false,
    image: "/images/products/plant-8.png"
  },
  {
    id: "p14",
    name: "ZZ Plant",
    price: 449,
    originalPrice: 599,
    category: "Indoor Plants",
    description: "Featuring glossy, dark green leaves on graceful wands. Known as the 'plant of steel' for its ability to survive almost anywhere.",
    careTips: {
      sunlight: "Low to bright indirect light",
      water: "Water every 2-3 weeks, let soil completely dry",
      growth: "Slow growing",
      benefits: ["Tolerates neglect", "Shade tolerant", "Air purifying"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 132,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-2.png"
  },
  {
    id: "p15",
    name: "Rubber Plant",
    price: 399,
    originalPrice: 499,
    category: "Indoor Plants",
    description: "A bold statement plant with large, glossy burgundy-green leaves. Can grow into an impressive indoor tree.",
    careTips: {
      sunlight: "Bright indirect light",
      water: "Water when the top inch of soil is dry",
      growth: "Moderate to fast growing tree",
      benefits: ["Striking dark foliage", "Removes indoor toxins", "Sturdy structure"]
    },
    inStock: true,
    rating: 4.7,
    reviews: 95,
    isNew: true,
    isBestseller: false,
    image: "/images/products/plant-4.png"
  },
  {
    id: "p16",
    name: "Cactus Mix",
    price: 199,
    originalPrice: 249,
    category: "Succulents",
    description: "A delightful assortment of small, easy-care cacti. Perfect for sunny windowsills and creating mini desert landscapes.",
    careTips: {
      sunlight: "Bright direct sunlight",
      water: "Water very sparingly, only when completely dry",
      growth: "Very slow growing",
      benefits: ["Thrives on neglect", "Unique shapes", "Drought resistant"]
    },
    inStock: true,
    rating: 4.5,
    reviews: 42,
    isNew: true,
    isBestseller: false,
    image: "/images/products/plant-7.png"
  },
  {
    id: "p17",
    name: "Rose Plant",
    price: 299,
    originalPrice: 399,
    category: "Flowering Plants",
    description: "The classic symbol of beauty. These potted roses bring vibrant color and sweet fragrance to sunny balconies or gardens.",
    careTips: {
      sunlight: "Full direct sun (6+ hours)",
      water: "Water regularly to keep soil evenly moist",
      growth: "Moderate growing shrub",
      benefits: ["Beautiful fragrant blooms", "Perennial beauty", "Attracts pollinators"]
    },
    inStock: true,
    rating: 4.6,
    reviews: 118,
    isNew: false,
    isBestseller: false,
    image: "/images/products/plant-6.png"
  },
  {
    id: "p18",
    name: "Hibiscus",
    price: 249,
    originalPrice: 299,
    category: "Flowering Plants",
    description: "A tropical beauty producing large, trumpet-shaped flowers. Adds a vibrant, exotic touch to sunny outdoor spaces.",
    careTips: {
      sunlight: "Full sun to partial shade",
      water: "Water daily during hot summer months",
      growth: "Fast growing shrub",
      benefits: ["Large showy flowers", "Continuous blooming", "Attracts hummingbirds"]
    },
    inStock: true,
    rating: 4.7,
    reviews: 86,
    isNew: false,
    isBestseller: false,
    image: "/images/products/plant-6.png"
  },
  {
    id: "p19",
    name: "Ficus Bonsai",
    price: 799,
    originalPrice: 999,
    category: "Bonsai Plants",
    description: "A meticulously shaped miniature Ficus tree. A living work of art that brings a sense of calm and zen to your space.",
    careTips: {
      sunlight: "Bright indirect to direct light",
      water: "Water when soil surface feels dry, avoid letting it dry completely",
      growth: "Slow growing, requires pruning",
      benefits: ["Living art piece", "Meditation focal point", "Long-lasting"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 54,
    isNew: true,
    isBestseller: true,
    image: "/images/products/plant-10.png"
  },
  {
    id: "p20",
    name: "Ceramic Pot (6-inch)",
    price: 349,
    originalPrice: 449,
    category: "Pots & Planters",
    description: "A premium, minimalist ceramic planter with a drainage hole and matching saucer. Perfect for medium-sized indoor plants.",
    careTips: {
      sunlight: "N/A",
      water: "Features drainage hole to prevent overwatering",
      growth: "N/A",
      benefits: ["Durable ceramic", "Includes drainage", "Modern design"]
    },
    inStock: true,
    rating: 4.8,
    reviews: 210,
    isNew: false,
    isBestseller: true,
    image: "/images/products/plant-3.png"
  }
];
