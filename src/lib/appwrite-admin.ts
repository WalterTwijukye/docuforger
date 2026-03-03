import { Client, Databases, Users } from 'node-appwrite';

export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
export const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY!;

// Database IDs
export const DATABASE_ID = '69a27c96000ed4d5c034';
export const COL_PROFILES = 'profiles';
export const COL_TEMPLATES = 'templates';
export const COL_DOCUMENTS = 'documents';
export const COL_USAGE = 'usage';

export function createAdminClient() {
    const client = new Client();

    if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
        console.warn('Appwrite admin variables not properly configured.');
    } else {
        client
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID)
            .setKey(APPWRITE_API_KEY);
    }

    return {
        get databases() {
            return new Databases(client);
        },
        get users() {
            return new Users(client);
        }
    };
}
