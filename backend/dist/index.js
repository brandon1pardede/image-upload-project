"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
const logger_1 = require("./config/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://your-frontend-url.onrender.com'
        : 'http://localhost:4200',
    credentials: true,
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Routes
app.use('/api/images', imageRoutes_1.default);
// Error handling middleware
app.use((err, req, res) => {
    logger_1.logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app.listen(port, () => {
            logger_1.logger.info(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
