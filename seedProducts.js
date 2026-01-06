import { supabase } from './config/supabaseClient.js';
import dotenv from 'dotenv';

dotenv.config();

const products = [
  // Snacks
  {
    name: "Mixed Dry Fruits (500g)",
    description: "Premium dry fruits mix",
    price: 450,
    image_url: "/placeholder.svg?height=300&width=300",
    stock: 50,
    category: "snacks",
    discount: 25,
  },
  {
    name: "Roasted Chickpeas (200g)",
    description: "Healthy roasted snack",
    price: 120,
    image_url: "/placeholder.svg?height=300&width=300",
    stock: 75,
    category: "snacks",
    discount: 20,
  },
  {
    name: "Organic Granola (400g)",
    description: "Healthy breakfast granola",
    price: 280,
    image_url: "/placeholder.svg?height=300&width=300",
    stock: 60,
    category: "snacks",
    discount: 20,
  },
  {
    name: "Cashew Nuts (250g)",
    description: "Premium cashew nuts",
    price: 380,
    image_url: "/placeholder.svg?height=300&width=300",
    stock: 40,
    category: "snacks",
    discount: 24,
  },
  
  // Chocolates
  {
    name: "Dark Chocolate Bar (100g)",
    description: "Premium dark chocolate",
    price: 150,
    image_url: "/placeholder.svg?height=300&width=300",
    stock: 100,
    category: "chocolates",
    discount: 15,
  },
  {
    name: "Milk Chocolate Truffles (200g)",
    description: "Delicious milk chocolate truffles",
    price: 250,
    image_url: "/placeholder.svg?height=300&width=300",
    stock: 80,
    category: "chocolates",
    discount: 20,
  },
  {
    name: "Assorted Chocolates Box (300g)",
    description: "Premium chocolate assortment",
    price: 450,
    image_url: "/placeholder.svg?height=300&width=300",
    stock: 50,
    category: "chocolates",
    discount: 18,
  },
  {
    name: "White Chocolate Bar (100g)",
    description: "Creamy white chocolate",
    price: 140,
    image_url: "/placeholder.svg?height=300&width=300",
    stock: 90,
    category: "chocolates",
    discount: 12,
  },
  
  // Utensils
  {
    name: "Non-Stick Frying Pan (10 inch)",
    description: "Durable non-stick cookware",
    price: 450,
    image_url: "/non-stick-frying-pan.jpg",
    stock: 30,
    category: "utensils",
    discount: 25,
  },
  {
    name: "Stainless Steel Pressure Cooker (5L)",
    description: "Heavy-duty pressure cooker",
    price: 1200,
    image_url: "/pressure-cooker-stainless-steel.jpg",
    stock: 25,
    category: "utensils",
    discount: 20,
  },
  {
    name: "Mixing Bowls Set (3 pieces)",
    description: "Stainless steel mixing bowls",
    price: 280,
    image_url: "/mixing-bowls-stainless-steel-set.jpg",
    stock: 40,
    category: "utensils",
    discount: 20,
  },
  {
    name: "Kitchen Knife Set (6 pieces)",
    description: "Professional kitchen knives",
    price: 650,
    image_url: "/kitchen-knife-set-professional.jpg",
    stock: 20,
    category: "utensils",
    discount: 24,
  },
];

async function seedProducts() {
  console.log('🌱 Starting to seed products...');
  
  try {
    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️  Products already exist in the database. Skipping seed.');
      return;
    }
    
    // Insert products
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();
    
    if (error) {
      console.error('❌ Error seeding products:', error);
      throw error;
    }
    
    console.log(`✅ Successfully seeded ${data.length} products!`);
    console.log('\n📦 Seeded Products:');
    data.forEach(product => {
      console.log(`   - ${product.name} (${product.category})`);
    });
    
  } catch (error) {
    console.error('❌ Failed to seed products:', error.message);
    process.exit(1);
  }
}

seedProducts().then(() => {
  console.log('\n🎉 Seeding completed!');
  process.exit(0);
});













