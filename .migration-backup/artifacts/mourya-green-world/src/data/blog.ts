export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Best Indoor Plants for Indian Homes in 2024",
    slug: "best-indoor-plants",
    excerpt: "Discover the top indoor plants that thrive in Indian climate conditions while adding beauty to your space.",
    content: "When choosing indoor plants for Indian homes, you need to consider our unique climate, which often features hot summers and variable humidity. The best choices are those that are hardy and forgiving.\n\n1. Snake Plant: Almost indestructible and great for air purification.\n2. Money Plant: Thrives in our climate and is considered lucky.\n3. Areca Palm: Brings a tropical feel and handles warm temperatures well.\n4. ZZ Plant: Perfect for low-light corners and requires minimal watering.\n\nThese plants not only survive but thrive in Indian homes, making them perfect for both beginners and experienced plant parents.",
    category: "Indoor Plants",
    readTime: "4 min read",
    date: "May 15, 2024",
    image: "/images/products/plant-1.png"
  },
  {
    id: "b2",
    title: "Lucky Plants That Bring Prosperity",
    slug: "lucky-plants-home",
    excerpt: "Learn which plants are considered lucky in Vastu and Feng Shui to bring positive energy to your home.",
    content: "According to Vastu Shastra and Feng Shui, certain plants attract positive energy, wealth, and prosperity when placed in the right direction.\n\nMoney Plant: Keep it in the southeast corner for financial luck.\nLucky Bamboo: The number of stalks matters - three for happiness, five for health, and eight for wealth.\nJade Plant: With its coin-like leaves, it's traditionally placed near the entrance to welcome prosperity.\nTulsi: Highly auspicious in Indian culture, best placed in the north or northeast.\n\nIncorporating these plants can create a more positive and balanced environment in your living space.",
    category: "Lucky Plants",
    readTime: "3 min read",
    date: "June 02, 2024",
    image: "/images/products/plant-5.png"
  },
  {
    id: "b3",
    title: "Top Air Purifying Plants for Your Space",
    slug: "air-purifying-plants",
    excerpt: "Breathe easier with these natural air purifiers that remove toxins from your indoor environment.",
    content: "Indoor air can sometimes be more polluted than outdoor air. Thankfully, nature has provided us with efficient air purifiers.\n\nPeace Lily: Excellent at removing mold spores and formaldehyde.\nSpider Plant: Quick to remove carbon monoxide and xylene.\nSnake Plant: Unique because it releases oxygen at night, making it perfect for bedrooms.\nAloe Vera: Clears formaldehyde and benzene while providing healing gel.\n\nHaving a mix of these plants can significantly improve your indoor air quality and overall well-being.",
    category: "Plant Care",
    readTime: "5 min read",
    date: "July 12, 2024",
    image: "/images/products/plant-2.png"
  },
  {
    id: "b4",
    title: "Monsoon Plant Care Guide",
    slug: "monsoon-plant-care",
    excerpt: "Essential tips to keep your plants healthy and thriving during the rainy season.",
    content: "The monsoon brings life, but it can also bring challenges for plant parents. High humidity and less sunlight mean you need to adjust your care routine.\n\nWatering: Reduce watering frequency. Only water when the top inch of soil is completely dry.\nDrainage: Ensure all pots have clear drainage holes to prevent root rot.\nLocation: Move sensitive plants away from direct rain, but ensure they still get indirect light.\nPests: High humidity attracts pests like mealybugs and fungus gnats. Keep Neem oil handy.\n\nWith these adjustments, your plants will enjoy the monsoon without the risk of overwatering or fungal infections.",
    category: "Plant Care",
    readTime: "6 min read",
    date: "August 05, 2024",
    image: "/images/products/plant-4.png"
  },
  {
    id: "b5",
    title: "Beginner's Guide to Gardening",
    slug: "beginners-gardening-tips",
    excerpt: "Starting your plant journey? Here are the fundamental rules every new plant parent should know.",
    content: "Starting a garden or an indoor plant collection can be intimidating, but it doesn't have to be. Follow these basic rules:\n\n1. Start Small: Begin with hardy plants like Pothos or Snake plants.\n2. Light is Key: Observe the light in your space before buying a plant. A high-light plant will slowly die in a dark corner.\n3. The Finger Test: Always feel the soil before watering. Overwatering kills more plants than underwatering.\n4. Drainage: Never put a plant in a pot without a drainage hole.\n\nRemember, every expert gardener has killed a few plants. It's part of the learning process!",
    category: "Guides",
    readTime: "7 min read",
    date: "September 18, 2024",
    image: "/images/products/plant-8.png"
  },
  {
    id: "b6",
    title: "How to Care for Succulents",
    slug: "succulent-care-guide",
    excerpt: "Master the art of growing these beautiful, drought-resistant plants without overwatering them.",
    content: "Succulents are popular for their unique shapes and low maintenance, but they have specific needs that differ from typical houseplants.\n\nSoil: They need well-draining soil. Mix regular potting soil with perlite or coarse sand.\nWatering: The 'soak and dry' method is best. Water thoroughly until it runs out the bottom, then wait until the soil is 100% dry before watering again.\nLight: Most succulents need bright, indirect light or some direct morning sun.\nPotting: Terracotta pots are excellent for succulents because they breathe, helping the soil dry faster.\n\nWith the right soil and watering habits, your succulents will thrive for years.",
    category: "Succulents",
    readTime: "4 min read",
    date: "October 22, 2024",
    image: "/images/products/plant-7.png"
  }
];