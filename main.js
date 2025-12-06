const express = require('express');
const cors = require('cors');
require('dotenv').config();
const loggerMiddleware = require('./middleware/Logger'); 

const { auth } = require('./middleware/auth');
const { connectDB } = require('./config/db');


const publicRoutes = require('./routes/public');
const eventRoutes = require('./routes/event');


const app = express();
app.use(cors());
app.use(loggerMiddleware);
app.use(express.json());

connectDB().then(() => {
  console.log("MongoDB Connected!");

  app.use('/api', publicRoutes);
  app.use('/api/admins', auth, eventRoutes);      

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
