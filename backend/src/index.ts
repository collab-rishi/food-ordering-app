import express, { Request, Response } from 'express';
import { configDotenv } from 'dotenv';
import authRoutes from './routes/auth.routes';
configDotenv();

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/api/auth', authRoutes);


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


app.listen(port, () => {
  console.log(`server is listening on port: http://localhost:${port}`);
});
