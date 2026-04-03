import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';

const app = express();

await connectDB();

//middleware
app.use(express.json()); // cho phep fe gui du lieu dang json len server
app.use(cors()); // cho phep fe truy cap api


//routes: dung de adminRouter de xu ly cac route lien quan den admin
app.get('/', (req, res) => res.send('api is working'));
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 3000;
// start server va lang nghe port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;