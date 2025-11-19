import express from "express";
import cors from "cors";                 // <-- ajouter ça
import userRoutes from "./src/routes/user.js";
import reportRoutes from "./src/routes/report.js";
import commentRoutes from "./src/routes/comment.js";
import zoneRoutes from "./src/routes/zone.js";
import voteRoutes from "./src/routes/vote.js";
import reportTypeRoutes from "./src/routes/reportType.js";

const app = express();
const port = 3001;

// CORS : autoriser le front Vite
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API SafeWalk');
});

app.use('/users', userRoutes);
app.use('/reports', reportRoutes);
app.use('/comments', commentRoutes);
app.use('/zones', zoneRoutes);
app.use('/votes', voteRoutes);
app.use('/report-types', reportTypeRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// 500
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});