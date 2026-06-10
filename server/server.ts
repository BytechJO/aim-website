import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { initDB } from './src/DB/initDB';
import { seedSuperAdmin } from './src/DB/seedSuperAdmin';
import { initSocket } from './src/socket';
import authRoutes from './src/routes/auth.routes';
import adminRoutes from './src/routes/admins.routes';
import productRoutes from './src/routes/products.routes';
import reviewRoutes from './src/routes/reviews.routes';
import instagramRoutes from './src/routes/instagram.routes';
import contactRoutes from './src/routes/contact.routes';
import newsletterRoutes from './src/routes/newsletter.routes';
import uploadRoutes, { uploadsDir } from './src/routes/upload.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const server = http.createServer(app);

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

initDB()
  .then(() => seedSuperAdmin())
  .then(() => {
    initSocket(server);
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
