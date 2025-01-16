import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const authFileSU = path.resolve(__dirname, '../../playwright/.auth/superuser.json');
export const authFileAdmin = path.resolve(__dirname, '../../playwright/.auth/admin.json');
export const authFileUser = path.resolve(__dirname, '../../playwright/.auth/user.json');
