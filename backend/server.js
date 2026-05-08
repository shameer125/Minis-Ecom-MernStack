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

/**
 * Normalize paths so `/products`, `/auth/login`, etc. hit the same handlers as `/api/products`, `/api/auth/login`.
 * Replit / browsers often call the API host without the `/api` prefix — without this you get `{ message: 'Route not found' }`.
 */
const API_ROOT_PREFIXES = ['/auth', '/products', '/orders', '/contact', '/admin', '/cart', '/health'];

app.use((req, res, next) => {
  const pathOnly = req.path || '/';
  if (pathOnly === '/') return next();
  if (pathOnly.startsWith('/api')) return next();

  const needsApiPrefix = API_ROOT_PREFIXES.some(
    (root) => pathOnly === root || pathOnly.startsWith(`${root}/`),
  );

  if (needsApiPrefix) {
    const qs = req.originalUrl.includes('?')
      ? req.originalUrl.slice(req.originalUrl.indexOf('?'))
      : '';
    req.url = `/api${pathOnly}${qs}`;
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

const healthJson = (req, res) =>
  res.json({ status: 'OK', message: 'MINIS API running' });
app.get('/api/health', healthJson);

// 404 handler (includes path so logs / clients can see what missed)
app.use((req, res) =>
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    path: req.path,
  }),
);

// Error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
