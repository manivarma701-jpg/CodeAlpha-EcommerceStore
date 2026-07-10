// Populates the database with a demo admin account and sample products.
// Run with:  npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

// NOTE: images are free-to-use placeholder photos (picsum.photos), not scraped
// from any retailer. Swap the `image` field for your own product photos any time.
const img = (seed) => `https://picsum.photos/seed/${seed}/600/600`;

const products = [
  { name: 'Aurora Wireless Headphones', category: 'Electronics', price: 2499, mrp: 3999, stock: 40, rating: 4.4, image: img('aurora-headphones'), description: 'Over-ear wireless headphones with 30-hour battery life, active noise cancellation, and plush memory-foam ear cushions.' },
  { name: 'Pulse Smartwatch Pro', category: 'Electronics', price: 3299, mrp: 4999, stock: 25, rating: 4.2, image: img('pulse-smartwatch'), description: 'AMOLED smartwatch with heart-rate tracking, sleep analysis, and 10-day battery backup.' },
  { name: 'Nimbus 20000mAh Power Bank', category: 'Electronics', price: 1199, mrp: 1799, stock: 60, rating: 4.1, image: img('nimbus-powerbank'), description: 'Fast-charging 20000mAh power bank with dual USB-C ports and a slim aluminium body.' },
  { name: 'Orbit Mechanical Keyboard', category: 'Electronics', price: 2899, mrp: 3599, stock: 18, rating: 4.6, image: img('orbit-keyboard'), description: 'Hot-swappable mechanical keyboard with RGB backlighting and tactile brown switches.' },

  { name: 'Everyday Cotton Crew Tee', category: 'Fashion', price: 499, mrp: 899, stock: 100, rating: 4.0, image: img('cotton-tee'), description: '100% combed cotton crew-neck t-shirt, breathable and pre-shrunk, available in classic colours.' },
  { name: 'Voyager Denim Jacket', category: 'Fashion', price: 1799, mrp: 2999, stock: 30, rating: 4.3, image: img('denim-jacket'), description: 'Mid-wash denim jacket with a relaxed fit, built for layering across seasons.' },
  { name: 'Stride Running Shoes', category: 'Fashion', price: 2199, mrp: 3499, stock: 45, rating: 4.5, image: img('running-shoes'), description: 'Lightweight running shoes with breathable mesh uppers and responsive cushioned soles.' },
  { name: 'Horizon Canvas Backpack', category: 'Fashion', price: 1399, mrp: 2199, stock: 35, rating: 4.2, image: img('canvas-backpack'), description: 'Water-resistant canvas backpack with a padded 15-inch laptop sleeve and multiple pockets.' },

  { name: 'Brew Master Drip Coffee Maker', category: 'Home', price: 2299, mrp: 3199, stock: 20, rating: 4.3, image: img('coffee-maker'), description: '12-cup programmable drip coffee maker with a keep-warm plate and reusable filter.' },
  { name: 'Lumen LED Desk Lamp', category: 'Home', price: 899, mrp: 1499, stock: 55, rating: 4.1, image: img('desk-lamp'), description: 'Dimmable LED desk lamp with three colour temperatures and a USB charging port.' },
  { name: 'Cascade Non-Stick Cookware Set', category: 'Home', price: 3499, mrp: 4999, stock: 15, rating: 4.4, image: img('cookware-set'), description: '5-piece non-stick cookware set with heat-resistant handles, suitable for all stovetops.' },
  { name: 'Meadow Cotton Bedsheet Set', category: 'Home', price: 1299, mrp: 1999, stock: 40, rating: 4.0, image: img('bedsheet-set'), description: '300 thread-count cotton bedsheet set with two pillow covers, machine washable.' },

  { name: 'Flexi Yoga Mat', category: 'Sports', price: 799, mrp: 1299, stock: 50, rating: 4.2, image: img('yoga-mat'), description: '6mm extra-thick non-slip yoga mat with a carry strap, ideal for home workouts.' },
  { name: 'Ironclad Adjustable Dumbbells', category: 'Sports', price: 4499, mrp: 5999, stock: 12, rating: 4.5, image: img('dumbbells'), description: 'Pair of adjustable dumbbells, 2.5kg to 20kg each, with quick-lock weight plates.' },
  { name: 'Rally Badminton Racket Set', category: 'Sports', price: 999, mrp: 1599, stock: 28, rating: 4.0, image: img('badminton-set'), description: 'Set of two carbon-fibre badminton rackets with a cover and three shuttlecocks.' },
  { name: 'Basecamp 2-Person Tent', category: 'Sports', price: 2799, mrp: 3999, stock: 10, rating: 4.3, image: img('camping-tent'), description: 'Lightweight waterproof 2-person tent that sets up in under five minutes.' }
];

async function seed() {
  await connectDB();

  console.log('Clearing existing products, carts and orders...');
  await Promise.all([Product.deleteMany({}), Cart.deleteMany({}), Order.deleteMany({})]);

  console.log('Inserting sample products...');
  await Product.insertMany(products);

  const adminEmail = 'admin@codealpha.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    console.log('Creating demo admin account...');
    await User.create({
      name: 'CodeAlpha Admin',
      email: adminEmail,
      password: 'admin123',
      isAdmin: true
    });
  } else {
    console.log('Demo admin account already exists, skipping.');
  }

  console.log('\nSeed complete!');
  console.log(`Products inserted: ${products.length}`);
  console.log(`Demo login -> email: ${adminEmail}  |  password: admin123`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
