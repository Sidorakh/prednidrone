import {config} from 'dotenv';
config();

// discord
export const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN || '';
export const GUILD_ID: string = process.env.GUILD_ID || '';

// firebase auth
export const FIREBASE_EMAIL: string = process.env.FIREBASE_EMAIL || '';
export const FIREBASE_PASSWORD: string = process.env.FIREBASE_PASSWORD || '';

// firebase config
export const FIREBASE_API_KEY: string = process.env.FIREBASE_API_KEY || '';
export const FIREBASE_AUTH_DOMAIN: string = process.env.FIREBASE_AUTH_DOMAIN || '';
export const FIREBASE_DATABASE_URL: string = process.env.FIREBASE_DATABASE_URL || '';
export const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID || '';
export const FIREBSAE_STORAGE_BUCKET: string = process.env.FIREBSAE_STORAGE_BUCKET || '';
export const FIREBASE_MESSAGING_SENDER_ID: string = process.env.FIREBASE_MESSAGING_SENDER_ID || '';
export const FIREBASE_APP_ID: string = process.env.FIREBASE_APP_ID || '';
export const FIREBASE_MEASUREMENT_ID: string = process.env.FIREBASE_MEASUREMENT_ID || '';