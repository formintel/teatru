import express from 'express';
import { getUserNotifications, markNotificationAsRead, createNotification, deleteNotification } from '../controllers/notification-controller.js';
import { verifyToken } from '../middleware/auth.js';

const notificationRouter = express.Router();

// Rute protejate (necesită autentificare)
notificationRouter.use(verifyToken);

// Obține notificările unui utilizator
notificationRouter.get('/user/:userId', getUserNotifications);

// Marchează o notificare ca citită
notificationRouter.patch('/:notificationId/read', markNotificationAsRead);

// Creează o notificare (doar pentru admin)
notificationRouter.post('/', createNotification);

// Șterge o notificare
notificationRouter.delete('/:notificationId', deleteNotification);

export default notificationRouter; 