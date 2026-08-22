import { Router } from 'express';
import { MarketController } from '../controllers/market.controller';

const router = Router();

router.get('/coins', MarketController.getCoins);
router.get('/pairs', MarketController.getPairs);
router.get('/pairs/:symbol', MarketController.getPairDetail);
router.get('/orderbook', MarketController.getOrderBook);
router.get('/candles', MarketController.getCandlestickData);
router.get('/trades', MarketController.getRecentTrades);

export default router;
