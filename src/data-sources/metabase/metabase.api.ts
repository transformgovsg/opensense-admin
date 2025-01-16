import axios from 'axios';

export const metabaseClient = axios.create({
  baseURL: process.env.METABASE_URL,
  headers: {
    'x-api-key': process.env.METABASE_API_KEY,
  },
});
