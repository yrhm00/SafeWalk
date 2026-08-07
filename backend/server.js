import 'dotenv/config';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import router from "./src/routes/index.js";

const app = express();
const port = process.env.PORT || 3001;
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
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use(apiVersion, router);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`SafeWalk API running on http://localhost:${port}`);
});
