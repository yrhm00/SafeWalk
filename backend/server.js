import express from "express";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./src/routes/user.js";
import reportRoutes from "./src/routes/report.js";
import commentRoutes from "./src/routes/comment.js";
import zoneRoutes from "./src/routes/zone.js";
import voteRoutes from "./src/routes/vote.js";
import reportTypeRoutes from "./src/routes/reportType.js";
import morgan from "morgan";

const app = express();
const port = 3001;
const apiVersion = '/api/v1';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SafeWalk API',
            version: '1.0.0',
            description: 'Documentation de l\'API SafeWalk (Projet Scolaire)',
        },
        servers: [
            {
                url: 'http://localhost:3001/api/v1',
                description: 'Serveur Local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/routes/*.js'], // Chemin vers les fichiers annotés
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(morgan("dev"));

// Parser JSON
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
// Route de base
app.get('/', (req, res) => {
    res.json({
        message: 'API SafeWalk',
        version: '1.0',
        endpoints: {
            users: apiVersion + '/users',
            reports: apiVersion + '/reports',
            comments: apiVersion + '/comments',
            zones: apiVersion + '/zones',
            votes: apiVersion + '/votes',
            reportTypes: apiVersion + '/report-types'
        }
    });
});

// Routes
app.use(apiVersion + '/users', userRoutes);
app.use(apiVersion + '/reports', reportRoutes);
app.use(apiVersion + '/comments', commentRoutes);
app.use(apiVersion + '/zones', zoneRoutes);
app.use(apiVersion + '/votes', voteRoutes);
app.use(apiVersion + '/report-types', reportTypeRoutes);

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