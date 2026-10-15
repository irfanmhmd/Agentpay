import 'dotenv/config';
import express from 'express';
import { getNetworks, getWallet } from './wallet.js';

export function createApiRouter() {
  const router = express.Router();
  router.use(express.json({ limit: '32kb' }));
  router.get('/api/health', (_request, response) => response.json({ ok: true }));
  router.get('/api/networks', getNetworks);
  router.get('/api/wallet', (request, response) => void getWallet(request, response));
  return router;
}
