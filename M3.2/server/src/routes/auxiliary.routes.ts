import { Router } from 'express';
import {
  DataSourceController,
  AlertController,
  ReportController,
  SupportController
} from '../controllers/datasource.controller';
import { authenticate } from '../middleware/auth.middleware';

export const dataSourceRoutes = Router();
dataSourceRoutes.use(authenticate);
dataSourceRoutes.get('/', DataSourceController.getAll);
dataSourceRoutes.post('/', DataSourceController.create);
dataSourceRoutes.put('/:id', DataSourceController.update);
dataSourceRoutes.delete('/:id', DataSourceController.delete);

export const alertRoutes = Router();
alertRoutes.use(authenticate);
alertRoutes.get('/', AlertController.getAll);
alertRoutes.post('/', AlertController.create);
alertRoutes.put('/:id', AlertController.update);
alertRoutes.delete('/:id', AlertController.delete);

export const reportRoutes = Router();
reportRoutes.use(authenticate);
reportRoutes.get('/', ReportController.getAll);
reportRoutes.post('/', ReportController.create);
reportRoutes.delete('/:id', ReportController.delete);

export const supportRoutes = Router();
supportRoutes.use(authenticate);
supportRoutes.get('/', SupportController.getAll);
supportRoutes.post('/', SupportController.create);
supportRoutes.put('/:id', SupportController.update);
