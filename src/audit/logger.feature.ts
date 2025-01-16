import loggerFeature from '@adminjs/logger';

import { componentLoader } from '../component-loader.js';

const enableLogging = () =>
  loggerFeature({
    componentLoader,
    propertiesMapping: {
      user: 'userId',
    },
    userIdAttribute: 'email',
  });

export default enableLogging;
