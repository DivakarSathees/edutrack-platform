const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const importRoutes = require('./routes/import');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const instituteRoutes = require('./routes/institutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Routes
app.use('/api', importRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/institutes', instituteRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
