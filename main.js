const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const publicRoutes = require('./routes/public');

const app = express();
app.use(cors());
app.use(express.json());

connectDB().then(() => {
  console.log("MongoDB Connected!");

  app.use('/api', publicRoutes); // <- all public routes

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
