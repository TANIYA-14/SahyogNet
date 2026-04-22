import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import needsRouter from './routes/needs.js';
import volunteersRouter from './routes/volunteers.js';
import matchesRouter from './routes/matches.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
app.use('/api/needs', needsRouter);
app.use('/api/volunteers', volunteersRouter);
app.use('/api', matchesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
