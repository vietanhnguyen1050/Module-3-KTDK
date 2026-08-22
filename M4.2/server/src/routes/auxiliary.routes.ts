import { Router } from 'express';
import { AlertController, PromotionController, SupportController } from '../controllers/auxiliary.controller';
import { authenticate } from '../middleware/auth.middleware';

export const alertRoutes = Router();
alertRoutes.use(authenticate);
alertRoutes.get('/', AlertController.getAlerts);
alertRoutes.post('/', AlertController.createAlert);
alertRoutes.delete('/:id', AlertController.deleteAlert);

export const promotionRoutes = Router();
promotionRoutes.get('/', PromotionController.getPromotions);
promotionRoutes.post('/', authenticate, PromotionController.create);
promotionRoutes.put('/:id', authenticate, PromotionController.update);
promotionRoutes.delete('/:id', authenticate, PromotionController.delete);

export const supportRoutes = Router();
supportRoutes.use(authenticate);
supportRoutes.get('/', SupportController.getTickets);
supportRoutes.post('/', SupportController.createTicket);
supportRoutes.put('/:id', SupportController.replyTicket);
