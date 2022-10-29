/**
 * PUERTO
 */
export const PORT = process.env.PORT || 5001;

/**
 * Database connection
 */
export const MONGO_CONNECTION =
  process.env.MONGO_CONNECTION ||
  'mongodb+srv://tyto:gxN4lPHdFjAYLzeI@cluster0.emi8e.mongodb.net/envios';
//'mongodb+srv://tyto:<password>@cluster0.emi8e.mongodb.net/?retryWrites=true&w=majority';

/**
 * Firebase private key
 */

export const Alp = 'src/utils/parent-cats.json';

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  'src/config/firebase-key-dev.json';
export const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS;
/**
 * Default API Message
 */

export const DEFAULT_API_WELCOME_MESSAGE =
  process.env.DEFAULT_API_WELCOME_MESSAGE || 'encarga Envios!';

export const SENDGRID_TEMPL_ID = process.env.SENDGRID_TEMPL_ID || '';
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
export const STRIPE_API_KEY =
  process.env.STRIPE_API_KEY ||
  'sk_test_51L1ziOFEU9NmrqwcB4Lo1MlV8Prjov252R0EdqR1dLy1xEdu0wrA8QDEs4OImiIvavhBEauLgO5QueOLw5zJeN2900iYJ12vqi';
export const SENDGRID_TEMPL_ID_MONEY =
  process.env.SENDGRID_TEMPL_ID_MONEY || '';
