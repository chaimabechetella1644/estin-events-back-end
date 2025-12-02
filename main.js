const express = require('express');
const cors = require('cors');

// const connectDB = require('./config/db');
// require('dotenv').config();

const app = express();
// connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', require('./routes/event'));
// app.use('/api/clubs', require('./routes/clubs'));
// app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
