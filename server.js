const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import routes
const usedItemsRoutes = require('./routes/usedItems');

// Routes
app.use('/api/used-items', usedItemsRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
