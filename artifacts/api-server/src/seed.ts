import { db, adminUsersTable, categoriesTable, plantsTable, galleryTable, siteSettingsTable, activityLogTable } from "@workspace/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Admin user
  const existingAdmin = await db.select().from(adminUsersTable).limit(1);
  if (existingAdmin.length === 0) {
    const hash = await bcrypt.hash("Admin@123", 12);
    await db.insert(adminUsersTable).values({
      email: "admin@mouryagreenworld.com",
      passwordHash: hash,
    });
    console.log("Admin created: admin@mouryagreenworld.com / Admin@123");
  }

  // Categories
  const existingCats = await db.select().from(categoriesTable).limit(1);
  if (existingCats.length === 0) {
    const cats = await db.insert(categoriesTable).values([
      { name: "Indoor Plants", description: "Perfect plants for your home interiors" },
      { name: "Outdoor Plants", description: "Hardy plants for gardens and landscapes" },
      { name: "Flowering Plants", description: "Vibrant blooms to brighten any space" },
      { name: "Succulents & Cacti", description: "Low-maintenance desert beauties" },
      { name: "Fruit Trees", description: "Grow your own fresh fruits at home" },
      { name: "Herbs & Vegetables", description: "Fresh herbs and vegetables for your kitchen" },
    ]).returning();

    // Plants
    await db.insert(plantsTable).values([
      {
        name: "Money Plant",
        description: "A popular indoor plant known to bring good luck and prosperity. Easy to grow and maintain.",
        price: "₹150",
        categoryId: cats[0].id,
        featured: true,
        careInstructions: "Water once a week. Keep away from direct sunlight.",
        sunlight: "Indirect light",
        water: "Once a week",
      },
      {
        name: "Peace Lily",
        description: "Elegant white flowers with deep green leaves. Excellent air purifier.",
        price: "₹299",
        categoryId: cats[0].id,
        featured: true,
        careInstructions: "Water when topsoil is dry. Mist leaves occasionally.",
        sunlight: "Low to indirect light",
        water: "When topsoil is dry",
      },
      {
        name: "Snake Plant",
        description: "Nearly indestructible, perfect for beginners. Purifies air at night.",
        price: "₹249",
        categoryId: cats[0].id,
        featured: true,
        careInstructions: "Water every 2-3 weeks. Tolerates low light.",
        sunlight: "Low to bright indirect light",
        water: "Every 2-3 weeks",
      },
      {
        name: "Hibiscus",
        description: "Stunning large flowers in vibrant shades of red, pink, and yellow.",
        price: "₹199",
        categoryId: cats[2].id,
        featured: true,
        careInstructions: "Full sun required. Water daily in summer.",
        sunlight: "Full sun",
        water: "Daily",
      },
      {
        name: "Aloe Vera",
        description: "Medicinal succulent with thick fleshy leaves. Great for skin care.",
        price: "₹99",
        categoryId: cats[3].id,
        featured: true,
        careInstructions: "Water every 3 weeks. Needs well-draining soil.",
        sunlight: "Bright indirect light",
        water: "Every 3 weeks",
      },
      {
        name: "Bougainvillea",
        description: "Vibrant climbing plant with beautiful paper-like bracts in pink, purple, or orange.",
        price: "₹350",
        categoryId: cats[1].id,
        featured: false,
        careInstructions: "Full sun. Water moderately, allow to dry between watering.",
        sunlight: "Full sun",
        water: "Moderate",
      },
      {
        name: "Tulsi (Holy Basil)",
        description: "Sacred herb with immense medicinal and spiritual significance in Indian culture.",
        price: "₹79",
        categoryId: cats[5].id,
        featured: false,
        careInstructions: "Needs plenty of sunlight. Water daily.",
        sunlight: "Full sun",
        water: "Daily",
      },
      {
        name: "Curry Leaf Tree",
        description: "Essential culinary herb for South Indian cooking. Aromatic dark green leaves.",
        price: "₹199",
        categoryId: cats[5].id,
        featured: false,
        careInstructions: "Full sun. Water regularly. Add neem cake occasionally.",
        sunlight: "Full sun",
        water: "Regular",
      },
    ]);

    console.log("Plants and categories seeded.");
  }

  // Site settings
  const existingSettings = await db.select().from(siteSettingsTable).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(siteSettingsTable).values({
      heroTitle: "Welcome to Mourya Green World",
      heroSubtitle: "Your trusted plant nursery for premium quality plants and gardening services",
      aboutText: "Mourya Green World is a family-owned plant nursery dedicated to bringing nature's beauty to your home and garden. We specialize in a wide variety of indoor and outdoor plants, offering expert care advice and premium quality plants at affordable prices. With over 15 years of experience, we are committed to helping you create the green space of your dreams.",
      phone: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      email: "info@mouryagreenworld.com",
      address: "123 Garden Lane, Green Nagar, Hyderabad, Telangana 500001",
      service1Title: "Premium Plants",
      service1Desc: "Carefully sourced and nurtured plants from trusted growers for your garden and home.",
      service2Title: "Expert Consultation",
      service2Desc: "Get personalized advice on plant care, landscaping, and garden design from our experts.",
      service3Title: "Home Delivery",
      service3Desc: "We deliver your plants safely to your doorstep across Hyderabad and surrounding areas.",
      service4Title: "Landscape Design",
      service4Desc: "Transform your outdoor space with our professional landscape design and installation services.",
    });
    console.log("Site settings seeded.");
  }

  // Activity log
  await db.insert(activityLogTable).values([
    { type: "system", message: "Mourya Green World website initialized" },
    { type: "plant", message: "Added plant: Money Plant" },
    { type: "plant", message: "Added plant: Peace Lily" },
    { type: "category", message: "Created category: Indoor Plants" },
  ]);

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
