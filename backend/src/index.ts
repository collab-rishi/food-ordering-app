import express, { Request, Response } from 'express';
import { configDotenv } from 'dotenv';
import authRoutes from './routes/auth.routes';
import restaurantRoutes from './routes/restaurant.routes';
import menuRoutes from './routes/menu.routes';
import { authenticate, authorize } from './middleware/auth.middleware';
configDotenv();

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Any logged-in user can see this
app.get('/api/test/member', authenticate, (req, res) => {
  res.json({ message: "Member access granted", user: (req as any).user });
});

app.use((err: any, req: any, res: any, next: any) => {
  if (err.name === 'ZodError') {
    return res.status(400).json({ success: false, errors: err.errors });
  }
  res.status(500).json({ success: false, message: err.message });
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuRoutes);


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Food Ordering System API is Live',
    version: '1.0.0',
  });
});


app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Only ADMINS can see this
app.get('/api/test/admin', authenticate, authorize(['ADMIN']), (req, res) => {
  res.json({ message: "Admin access granted", user: (req as any).user });
});




app.listen(port, () => {
  console.log(`server is listening on port: http://localhost:${port}`);
});
