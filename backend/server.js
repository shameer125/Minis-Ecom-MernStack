const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

if (!process.env.JWT_SECRET || !String(process.env.JWT_SECRET).trim()) {
  console.error(
    '❌ JWT_SECRET is not set. Add it in Replit Secrets (or backend/.env). Required for login and register.',
  );
  process.exit(1);
}

connectDB();

const app = express();

const corsOrigins = [
  'http://localhost:5173',
  'https://minis-ecom-mern-stack-fxdr.vercel.app',
  ...(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
];

// Middleware
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

/** Register router at both `/api/...` (canonical) and `/...` so clients without `/api` in base URL still work. */
function mountApiPair(basePath, router) {
  app.use(`/api${basePath}`, router);
  app.use(basePath, router);
}

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

mountApiPair('/auth', authRoutes);
mountApiPair('/products', productRoutes);
mountApiPair('/orders', orderRoutes);
mountApiPair('/cart', cartRoutes);
mountApiPair('/contact', contactRoutes);
mountApiPair('/admin', adminRoutes);

const healthJson = (req, res) =>
  res.json({ status: 'OK', message: 'MINIS API running' });
app.get('/api/health', healthJson);
app.get('/health', healthJson);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
