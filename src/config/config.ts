/**
 * PUERTO
 */
export const PORT = process.env.PORT || 5002;

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
/* 
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  'src/config/firebase-key-dev.json';
export const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS; */
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

export const FIREBASE_PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID || 'encarga-envios';

/**
 * Firebase Private Key
 */
export const FIREBASE_PRIVATE_KEY =
  process.env.FIREBASE_PRIVATE_KEY ||
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgqu3VabkkCszl\nxOMS0J3gSoM7ApZYmE8LKD/aVFBDL9IgekQy9Bavi3I1pT0hiFHULSCsC614BQy3\nPZwIeKWEmE3AjQRIH7LooSIm+PRO/blieZDGtBN5sx1lOrLZagx/TLL7YFOknfSR\nPJOwjN2cJYtlSOa8sffVIQsJ+NTIqUM5Iw/zidBiAdOM0UYIYi/JXasbpj66R5hX\nGKlsW549yf+CLoOwiowUvKHlFG2zsG9khTgu6rFZTKaOAFBvHZqtAN7HHIhBYqbx\n1FGTI8FSfu2ORoJsZEDoRXKLy5P7roWxdZEjQOBpzX0Pqzpy9j0jxPopkZvst1Y2\npqY0lFfFAgMBAAECggEAJ79BiTtXbwAxAmK73kq30+X7Ix0XvqEnZNY3PbcACC8L\nZ7d3qbdS6Wiw/256ehI0VC451/Ynmvp809QtBrd6Exxul8ULGyCkbQJ35XZPUj9Y\nnnD+jPm9m6zhB8sGtdyTbOa3nJKO/rmI6Gk5DEM9C8UKACuR0XqhmhtLlNL3KRC5\n6hh9PfaXQ+79ou5p6ATJ6UIH30rsiqy345inqYD0B6R2T509j0fC9TGPeqOTP2lD\nwDend634xIFuALoHHN1PiKqGNN2SIoPG0MpYr6LPpIGE9iuox9z+zTmUQh5t62Og\n5bCne5oCZvjMo2QD7Vnc8Zt9Iz5nP1ekxvdsSEyRwQKBgQDeMaXnYRp7lEd58Lzl\ni8iNCkclpeZLRlJ+KN9Z97EwMpyntQGPUqGQOD0QrY2kunllL9W4P4MBDz7aReuT\nXA81XDaHptQLkGm3dzXmZ3ELypncpGXN+Gl9iHH23aIMWNMI+T5XDozdcXCJWwKH\n4gkHibPVx2WjK52j/dKWnaiu8QKBgQC5HNymXLh7VpcA41aR/yeujnTQ4fnvCcRV\nn8qSi0hl+0DUDNjfAsQsjsndCU8Ul09mpb/5NhrVJqJfOA3LKR+p3AYfXb2VjxK3\nCYunH/Vae1rp6u0FjpbBgfUntwZ1x+A0LR1cRwyPjAq5kI2c7aXJl5jP5YC1MZq6\ngILJcJneFQKBgA3jDHtplj4jBlSYtzWhhudJvSidNcd+nalE5LC6ylg40ZGpvm82\nuuJIoYhpUHD7NpscYj8huQ5X5ZW+yPpsxoaPPNk9lAMlA3Zz/OppjKcwAm3H2JUG\n8ZDm9jh3oakj5AyrhznpruQoMuBiz8WuWuIduR+jVrbcAv483uyK7gABAoGBALFf\nm3n5THg6f1TFgXVBpXdYX0yry34lwLA+/a8vsP6vIu5NJR2DnBAJ/hlDSzgyyE1W\nMz4LfuiRLXLJ1kW+MO3kuyUhAIEnZ8plZiCMud+qZXHQvq7dc00WRp94e8Mt84Jr\nXD/IgJunl7s5bMha2snw7eb/RTXZwyZD744vy/AFAoGARy9Fps5pOT5kGRsnNs8t\nQRe73zV7sRVKjRkdseHJqD+KUqMce8E3iRgB+AbkQkC3ZhubLD0dwagKP+FxVFbo\nTUC6PHu2FGaf1ljONMRLAng/9Idn4G+eqg9iwRbB8bRdlmQXjlutnfFWrQnC5bV8\nZq5Rn86PW9w9jzH4HVe2sTY=\n-----END PRIVATE KEY-----\n';

/**
 * Firebase Private Key
 */
export const FIREBASE_CLIENT_EMAIL =
  process.env.FIREBASE_CLIENT_EMAIL ||
  'firebase-adminsdk-zj8pa@encarga-envios.iam.gserviceaccount.com';
