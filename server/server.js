require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json());

const clientOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true
  })
);

// --- Database ---
connectDB();

// --- Routes ---
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'CodeAlpha E-commerce API is running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// --- Central error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Allowed client origin: ${clientOrigin}`);
});
