import logger from '../../logger.js';

import { metabaseClient } from './metabase.api.js';

type MetabaseHealthResponse = {
  status: string;
};

export async function checkMetabase(): Promise<boolean> {
  try {
    const response = await metabaseClient.get<MetabaseHealthResponse>('/api/health');

    if (response.status !== 200) {
      logger.error(`Metabase health check failed with status: ${response.status}`);
      return false;
    }

    if (response.data.status !== 'ok') {
      logger.error(`Metabase health check failed with status: ${response.data}`);
      return false;
    }
  } catch (error) {
    // Log the error for further inspection
    logger.error(error, 'Error during Metabase health check');
    return false;
  }

  return true;
}
