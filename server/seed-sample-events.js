require('dotenv').config({ path: './config.env' });
const { query } = require('./db');

const sampleEvents = [
  {
    title: 'Tech Conference 2024: AI & Machine Learning',
    description: 'Join us for an exciting day of learning about the latest developments in AI and Machine Learning. Meet industry experts, attend workshops, and network with fellow tech enthusiasts. This conference will cover topics including deep learning, neural networks, computer vision, and practical AI applications in business.',
    event_date: '2024-09-15 09:00:00',
    location: 'Jakarta Convention Center, Hall A',
    category_id: 1, // Technology
    max_participants: 500,
    registration_fee: 250000,
    image_url: '/uploads/tech-conference.jpg',
    created_by: 1
  },
  {
    title: 'Digital Marketing Masterclass',
    description: 'Master the art of digital marketing in this comprehensive workshop. Learn about SEO, social media marketing, content creation, email marketing, and analytics. Perfect for entrepreneurs, marketers, and business owners looking to grow their online presence.',
    event_date: '2024-09-20 13:00:00',
    location: 'Bali International Convention Centre',
    category_id: 2, // Business
    max_participants: 150,
    registration_fee: 350000,
    image_url: '/uploads/digital-marketing.jpg',
    created_by: 1
  },
  {
    title: 'Indie Music Festival 2024',
    description: 'Experience the best of Indonesian indie music scene! Featuring 20+ local bands and solo artists across multiple stages. Food trucks, art installations, and merchandise booths will be available. A celebration of creativity and independent music culture.',
    event_date: '2024-10-05 16:00:00',
    location: 'Ancol Beach City, Jakarta',
    category_id: 3, // Entertainment
    max_participants: 2000,
    registration_fee: 150000,
    image_url: '/uploads/indie-festival.jpg',
    created_by: 1
  },
  {
    title: 'Startup Pitch Competition',
    description: 'Calling all entrepreneurs! Present your startup ideas to a panel of investors and industry experts. Winners will receive funding opportunities, mentorship, and business development support. Open to all stages of startups from ideation to early-stage companies.',
    event_date: '2024-09-28 10:00:00',
    location: 'Surabaya Creative Hub',
    category_id: 2, // Business
    max_participants: 100,
    registration_fee: 100000,
    image_url: '/uploads/startup-pitch.jpg',
    created_by: 1
  },
  {
    title: 'Photography Workshop: Street Photography',
    description: 'Learn the art of street photography from professional photographers. This hands-on workshop covers composition, lighting, storytelling through images, and post-processing techniques. Bring your camera and explore the streets of Yogyakarta while learning.',
    event_date: '2024-10-12 08:00:00',
    location: 'Malioboro Street, Yogyakarta',
    category_id: 4, // Workshop
    max_participants: 30,
    registration_fee: 200000,
    image_url: '/uploads/photography-workshop.jpg',
    created_by: 1
  },
  {
    title: 'Culinary Festival: Taste of Indonesia',
    description: 'Discover the rich flavors of Indonesian cuisine! Over 50 food vendors showcasing traditional and modern Indonesian dishes. Cooking demonstrations, spice market, and cultural performances throughout the day. A feast for all your senses!',
    event_date: '2024-10-20 11:00:00',
    location: 'Bandung Creative City Asia Africa',
    category_id: 3, // Entertainment
    max_participants: 1500,
    registration_fee: 75000,
    image_url: '/uploads/culinary-festival.jpg',
    created_by: 1
  },
  {
    title: 'Web Development Bootcamp',
    description: 'Intensive 3-day bootcamp covering modern web development. Learn HTML5, CSS3, JavaScript, React, Node.js, and database integration. Perfect for beginners and those looking to upgrade their skills. Includes hands-on projects and career guidance.',
    event_date: '2024-11-02 09:00:00',
    location: 'Hacktiv8 Campus, Jakarta',
    category_id: 1, // Technology
    max_participants: 80,
    registration_fee: 500000,
    image_url: '/uploads/web-bootcamp.jpg',
    created_by: 1
  },
  {
    title: 'Sustainable Living Workshop',
    description: 'Learn practical ways to live more sustainably. Topics include zero waste lifestyle, organic gardening, renewable energy, and eco-friendly products. Make your own natural cleaning products and take home starter plants for your garden.',
    event_date: '2024-11-15 14:00:00',
    location: 'Eco Park Sentul, Bogor',
    category_id: 4, // Workshop
    max_participants: 60,
    registration_fee: 125000,
    image_url: '/uploads/sustainable-living.jpg',
    created_by: 1
  }
];

async function seedSampleEvents() {
  try {
    console.log('🌱 Seeding sample events...');

    // First, let's check if categories exist
    const [categories] = await query('SELECT * FROM categories LIMIT 5');
    console.log(`Found ${categories.length} categories`);

    if (categories.length === 0) {
      console.log('Creating sample categories...');
      await query(`
        INSERT INTO categories (name, description) VALUES 
        ('Technology', 'Tech conferences, workshops, and meetups'),
        ('Business', 'Business seminars, networking, and entrepreneurship'),
        ('Entertainment', 'Concerts, festivals, and cultural events'),
        ('Workshop', 'Hands-on learning and skill development'),
        ('Sports', 'Sports events, competitions, and fitness')
      `);
      console.log('✅ Sample categories created');
    }

    // Clear existing sample events
    await query('DELETE FROM events WHERE created_by = 1');
    console.log('🗑️ Cleared existing sample events');

    // Insert sample events
    for (const event of sampleEvents) {
      await query(
        `INSERT INTO events (title, description, event_date, location, category_id, max_participants, registration_fee, image_url, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.title,
          event.description,
          event.event_date,
          event.location,
          event.category_id,
          event.max_participants,
          event.registration_fee,
          event.image_url,
          event.created_by
        ]
      );
    }

    console.log(`✅ Successfully seeded ${sampleEvents.length} sample events`);
    console.log('🎪 Sample events include:');
    sampleEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} - ${event.location}`);
    });

  } catch (error) {
    console.error('❌ Error seeding sample events:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedSampleEvents().then(() => {
    console.log('🎉 Sample event seeding completed!');
    process.exit(0);
  });
}

module.exports = { seedSampleEvents };
