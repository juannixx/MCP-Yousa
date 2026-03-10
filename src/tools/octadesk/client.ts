import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const baseURL = process.env.OCTADESK_BASE_URL ?? 'https://o195367-23c.api001.octadesk.services';

export const octadesk = axios.create({
  baseURL,
  headers: {
    'x-api-key':       process.env.OCTADESK_API_KEY ?? '',
    'octa-agent-email': process.env.OCTADESK_AGENT_EMAIL ?? '',
    'Content-Type':    'application/json',
  },
  timeout: 15000,
});

octadesk.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status;
    const message = err.response?.data?.message ?? err.message;
    throw new Error(`Octadesk API [${status}]: ${message}`);
  }
);
