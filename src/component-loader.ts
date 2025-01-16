import * as path from 'node:path';

import { ComponentLoader } from 'adminjs';

export const componentLoader = new ComponentLoader();

export const Components = {
  // ya need to path.resolve otherwise sourcemap enabled TS builds fail to run
  // it won't find the components below
  CustomLogin: componentLoader.override('Login', path.resolve(import.meta.dirname, './auth/login.component.js')),
  Dashboard: componentLoader.add('Dashboard', path.resolve(import.meta.dirname, './branding/dashboard.component.js')),
  // CustomFooter: componentLoader.override('Footer', './branding/footer.component'),
};
