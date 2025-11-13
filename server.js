import express from "express";
import userRoutes from "./routes/user.js";
import reportRoutes from "./routes/report.js";
import commentRoutes from "./routes/comment.js";
import zoneRoutes from "./routes/zone.js";
import voteRoutes from "./routes/vote.js";
import reportTypeRoutes from "./routes/reportType.js";

const app = express();
const port = 3001;

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

// Gestion simple 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Gestion simple erreurs
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});