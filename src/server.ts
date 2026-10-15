import 'dotenv/config';
import express from 'express';
import { createApiRouter } from './api-router.js';

const app = express();
const port = Number(process.env.API_PORT ?? 3001);

app.disable('x-powered-by');
app.use(createApiRouter());

app.listen(port, () => {
  console.log(`AgentPay API listening on port ${port}`);
});
