import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import groceryRoutes from './routes/grocery.routes';
import orderRoutes from './routes/order.routes';
import { prisma } from './config/prisma';
import { authMiddleware } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use middleware only on protected routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/groceries", authMiddleware, groceryRoutes);
app.use("/api/v1/orders", authMiddleware, orderRoutes);


app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await prisma.$connect();
        console.log('Connected to MySQL database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});

export default app;
