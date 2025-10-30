import { Platform } from 'react-native';
import {Client, Databases, Account} from 'react-native-appwrite';

const config = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    db: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
    table: {
        notes: process.env.EXPO_PUBLIC_APPWRITE_TABLE_NOTES_ID,
    }
}

console.log("Endpoint:", config.endpoint);
console.log("Project:", config.projectId);
console.log("DB:", config.db);
console.log("Table:", config.table.notes);

const client = new Client()
    .setEndpoint(config.endpoint) // Your API Endpoint
    .setProject(config.projectId); // Your project ID

switch (Platform.OS){
    case 'ios':
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID);
        break;
    case 'android':
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_ID);
        break;
}
 
const database = new Databases(client);
const account = new Account(client);

export {client, database, account ,config};