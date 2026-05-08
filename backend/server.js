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
 * Single router tree mounted twice:
 * - `/api/auth`, `/api/products`, … (canonical)
 * - `/auth`, `/products`, … (same handlers — fixes clients that omit `/api`)
 *
 * This avoids mutating req.url (unreliable on some hosts / proxies).
 */
const api = express.Router();
api.use('/auth', authRoutes);
api.use('/products', productRoutes);
api.use('/orders', orderRoutes);
api.use('/cart', cartRoutes);
api.use('/contact', contactRoutes);
api.use('/admin', adminRoutes);
api.get('/health', (req, res) =>
  res.json({ status: 'OK', message: 'MINIS API running' }),
);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Match `/api/*` first, then bare `/auth`, `/products`, etc.
app.use('/api', api);
app.use('/', api);

app.use((req, res) =>
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    path: req.path,
  }),
);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
