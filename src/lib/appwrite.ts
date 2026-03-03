import { Client, Account, Databases, Storage } from 'appwrite';

export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

// Database IDs
export const DATABASE_ID = '69a27c96000ed4d5c034';
export const COL_PROFILES = 'profiles';
export const COL_TEMPLATES = 'templates';
export const COL_DOCUMENTS = 'documents';
export const COL_USAGE = 'usage';

// Storage
export const BUCKET_FILES = '69a28647000df3e60e85';
export const BUCKET_DOCUMENTS = '69a28647000df3e60e85';

const appwriteClient = new Client();

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
    throw new Error('Appwrite variables not properly configured.');
}

appwriteClient
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);

export default appwriteClient;
