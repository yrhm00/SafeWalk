import express from "express";
import userRoutes from "./src/routes/user.js";
import reportRoutes from "./src/routes/report.js";
import commentRoutes from "./src/routes/comment.js";
import zoneRoutes from "./src/routes/zone.js";
import voteRoutes from "./src/routes/vote.js";
import reportTypeRoutes from "./src/routes/reportType.js";

const app = express();
const port = 3001;


// Parser JSON
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'API SafeWalk',
        version: '2.0',
        endpoints: {
            users: '/users',
            reports: '/reports',
            comments: '/comments',
            zones: '/zones',
            votes: '/votes',
            reportTypes: '/report-types'
        }
    });
});

// Routes
app.use('/users', userRoutes);
app.use('/reports', reportRoutes);
app.use('/comments', commentRoutes);
app.use('/zones', zoneRoutes);
app.use('/votes', voteRoutes);
app.use('/report-types', reportTypeRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Gestion des erreurs 500
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`🚀 SafeWalk API running on http://localhost:${port}`);
});