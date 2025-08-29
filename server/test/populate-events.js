const { pool } = require('../middleware/db');
require('dotenv').config({ path: './config.env' });

async function populateEvents() {
  try {
    console.log('🚀 Populating database with sample events...');
    
    // Sample events data
    const events = [
      {
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest technology conference of the year featuring industry leaders, innovative startups, and cutting-edge technologies. Learn about AI, blockchain, cloud computing, and the future of technology.',
        short_description: 'The biggest technology conference featuring AI, blockchain, and cloud computing innovations.',
        category_id: 1,
        organizer_id: 1,
        event_date: '2024-03-15',
        event_time: '09:00:00',
        end_date: '2024-03-15',
        end_time: '17:00:00',
        location: 'Jakarta Convention Center',
        address: 'Jl. Gatot Subroto, Senayan',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        max_participants: 500,
        price: 250000.00,
        is_free: false,
        status: 'published',
        is_featured: true
      },
      {
        title: 'Digital Marketing Workshop',
        description: 'Learn the latest digital marketing strategies including social media marketing, SEO, content marketing, and paid advertising. Perfect for business owners and marketing professionals.',
        short_description: 'Master digital marketing strategies including SEO, social media, and content marketing.',
        category_id: 2,
        organizer_id: 1,
        event_date: '2024-03-20',
        event_time: '10:00:00',
        end_date: '2024-03-20',
        end_time: '16:00:00',
        location: 'Bandung Creative Hub',
        address: 'Jl. Layang-Layang No. 8',
        city: 'Bandung',
        province: 'Jawa Barat',
        max_participants: 100,
        price: 150000.00,
        is_free: false,
        status: 'published',
        is_featured: false
      },
      {
        title: 'Programming Bootcamp',
        description: 'Intensive 3-day programming bootcamp covering web development fundamentals including HTML, CSS, JavaScript, React, and Node.js. Hands-on projects and mentorship included.',
        short_description: 'Intensive 3-day web development bootcamp with React and Node.js.',
        category_id: 3,
        organizer_id: 1,
        event_date: '2024-03-25',
        event_time: '09:00:00',
        end_date: '2024-03-27',
        end_time: '17:00:00',
        location: 'Surabaya Tech Park',
        address: 'Jl. Raya ITS, Keputih',
        city: 'Surabaya',
        province: 'Jawa Timur',
        max_participants: 50,
        price: 500000.00,
        is_free: false,
        status: 'published',
        is_featured: true
      },
      {
        title: 'Music Festival Yogyakarta',
        description: 'Experience the best of Indonesian and international music at this 2-day festival featuring rock, pop, jazz, and traditional music performances in the cultural heart of Indonesia.',
        short_description: 'Two-day music festival featuring rock, pop, jazz, and traditional performances.',
        category_id: 4,
        organizer_id: 1,
        event_date: '2024-04-05',
        event_time: '16:00:00',
        end_date: '2024-04-06',
        end_time: '23:00:00',
        location: 'Taman Budaya Yogyakarta',
        address: 'Jl. Sriwedani No. 1',
        city: 'Yogyakarta',
        province: 'DI Yogyakarta',
        max_participants: 2000,
        price: 75000.00,
        is_free: false,
        status: 'published',
        is_featured: true
      },
      {
        title: 'Health & Wellness Seminar',
        description: 'Learn about nutrition, mental health, fitness, and preventive healthcare from medical experts and wellness coaches. Includes free health screenings and wellness consultations.',
        short_description: 'Comprehensive health seminar with expert speakers and free health screenings.',
        category_id: 6,
        organizer_id: 1,
        event_date: '2024-04-15',
        event_time: '08:00:00',
        end_date: '2024-04-15',
        end_time: '15:00:00',
        location: 'Medan Convention Hall',
        address: 'Jl. Gagak Hitam No. 1',
        city: 'Medan',
        province: 'Sumatera Utara',
        max_participants: 300,
        price: 0.00,
        is_free: true,
        status: 'published',
        is_featured: false
      },
      {
        title: 'Community Cleanup Day',
        description: 'Join your local community in making our city cleaner and greener. Volunteer activities include beach cleanup, tree planting, and environmental education. All ages welcome!',
        short_description: 'Community volunteer event for environmental cleanup and tree planting.',
        category_id: 7,
        organizer_id: 1,
        event_date: '2024-04-20',
        event_time: '07:00:00',
        end_date: '2024-04-20',
        end_time: '12:00:00',
        location: 'Ancol Beach',
        address: 'Jl. Lodan Timur No. 7',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        max_participants: 200,
        price: 0.00,
        is_free: true,
        status: 'published',
        is_featured: false
      }
    ];

    // Insert events
    for (const event of events) {
      const query = `
        INSERT IGNORE INTO events (
          title, description, short_description, category_id, organizer_id,
          event_date, event_time, end_date, end_time, location, address,
          city, province, max_participants, price, is_free, status, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        event.title, event.description, event.short_description, event.category_id,
        event.organizer_id, event.event_date, event.event_time, event.end_date,
        event.end_time, event.location, event.address, event.city, event.province,
        event.max_participants, event.price, event.is_free, event.status, event.is_featured
      ];
      
      await pool.promise().query(query, values);
      console.log(`✅ Added event: ${event.title}`);
    }
    
    console.log('\n🎉 Sample events populated successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error populating events:', error);
    process.exit(1);
  }
}

populateEvents();
