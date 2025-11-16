const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const { initCronJobs } = require('./utils/cronJobs');
const { archiveEndedEvents } = require('./utils/eventCleanup');
const { runMigrations } = require('./migrations/runMigration');

const app = express();

// Trust proxy for Railway/Vercel (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware with relaxed CSP for production
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to allow inline scripts from Vite
  crossOriginEmbedderPolicy: false
}));
// CORS configuration - allow frontend domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  // Add your Vercel frontend domain here
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development, or check against allowed list
    if (process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In production, you might want to be more strict
      // For now, allow all origins for easier deployment
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cache-Control', 
    'Pragma', 
    'Expires',
    'X-Requested-With'
  ]
}));

// Rate limiting - more generous for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically with CORS headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database connection test endpoint
app.get('/api/db-test', async (req, res) => {
  const { promisePool } = require('./db');
  try {
    const [result] = await promisePool.query('SELECT DATABASE() as db_name, USER() as db_user, @@hostname as db_host');
    const [tables] = await promisePool.query('SHOW TABLES');
    
    res.json({
      success: true,
      message: 'Database connection successful',
      connection: {
        database: result[0].db_name,
        user: result[0].db_user,
        host: result[0].db_host,
        configured_host: process.env.DB_HOST,
        configured_db: process.env.DB_NAME,
        configured_port: process.env.DB_PORT
      },
      tables: tables.map(t => Object.values(t)[0]),
      table_count: tables.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      }
    });
  }
});

// Static files health check
app.get('/api/static-health', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const distPath = path.join(__dirname, 'dist');
  
  try {
    // Check if dist folder exists
    if (!fs.existsSync(distPath)) {
      return res.status(404).json({
        success: false,
        message: 'dist folder not found',
        path: distPath
      });
    }
    
    // List files in dist
    const files = fs.readdirSync(distPath);
    
    // Check for key files
    const indexHtml = fs.existsSync(path.join(distPath, 'index.html'));
    const assetsFolder = fs.existsSync(path.join(distPath, 'assets'));
    
    res.json({
      success: true,
      message: 'Static files health check',
      distPath: distPath,
      fileCount: files.length,
      files: files.slice(0, 10), // First 10 files
      indexHtmlExists: indexHtml,
      assetsFolderExists: assetsFolder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking static files',
      error: error.message
    });
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const eventRoutes = require('./routes/events');
const categoryRoutes = require('./routes/categories');
const registrationRoutes = require('./routes/registrations');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const articlesRoutes = require('./routes/articles');
const blogsRoutes = require('./routes/blogs');
const contactsRoutes = require('./routes/contacts');
const contactRoutes = require('./routes/contact');
const historyRoutes = require('./routes/history');
const uploadRoutes = require('./routes/upload');
const paymentRoutes = require('./routes/payments');
const attendanceRoutes = require('./routes/attendance');
const certificateRoutes = require('./routes/certificates');
const performersRoutes = require('./routes/performers');
const reviewsRoutes = require('./routes/reviews');
const reportsRoutes = require('./routes/reports');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/performers', performersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin/reports', reportsRoutes);

console.log('✅ Reports routes registered at /api/admin/reports');

// Serve static files from frontend build (for production)
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, 'dist');
  console.log('📁 Serving static files from:', frontendBuildPath);
  
  // Check if dist folder exists and has content
  const fs = require('fs');
  if (fs.existsSync(frontendBuildPath)) {
    const files = fs.readdirSync(frontendBuildPath);
    console.log('📄 Dist folder contains:', files.length, 'items');
    if (files.length === 0 || (files.length === 1 && files[0] === '.gitkeep')) {
      console.warn('⚠️  Dist folder is empty or only contains .gitkeep');
    }
  } else {
    console.error('❌ Dist folder does not exist:', frontendBuildPath);
  }
  
  // Log when static files are requested
  app.use((req, res, next) => {
    if (req.path.startsWith('/assets/') || req.path.endsWith('.js') || req.path.endsWith('.css')) {
      console.log('🔍 Static file request:', req.path);
    }
    next();
  });
  
  app.use(express.static(frontendBuildPath, {
    setHeaders: (res, path, stat) => {
      console.log('📄 Serving file:', path);
      // Ensure proper MIME types
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      } else if (path.endsWith('.css')) {
        res.set('Content-Type', 'text/css');
      }
    }
  }));
  
  // Serve index.html for all non-API routes (SPA support)
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    console.log('🏠 SPA route:', req.path);
    
    // Check if index.html exists
    const indexPath = path.join(frontendBuildPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.error('❌ index.html not found at:', indexPath);
      return res.status(404).send('Frontend build not found');
    }
    
    res.sendFile(indexPath);
  });
}

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

const PORT = process.env.PORT || 3000;

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    console.log('✅ All routes registered successfully\n');
    
    // Run database migrations first
    console.log('🔄 Running database migrations...');
    try {
      await runMigrations();
    } catch (error) {
      console.error('❌ Migration failed:', error);
    }
    
    // Run initial cleanup on server start
    console.log('🧹 Running initial event archival...');
    try {
      const result = await archiveEndedEvents();
      console.log(`✅ Initial archival complete: ${result.archived} events archived`);
    } catch (error) {
      console.error('❌ Initial archival failed:', error);
    }
    
    // Initialize cron jobs for automatic archival
    initCronJobs();
  });
}

module.exports = app;

