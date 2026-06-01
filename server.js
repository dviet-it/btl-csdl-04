const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/variants', require('./routes/variants'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/import-orders', require('./routes/importOrders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/discounts', require('./routes/discounts'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Serve main app
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🧵 Fashion Store Manager running at http://localhost:${PORT}\n`);
});
