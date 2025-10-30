import {database} from './appwrite';

const databaseService = {
    // List documents
    async listDocuments(dbId , tableId , queries = []) {
        // List docments
        try{
            const response = await database.listDocuments(dbId, tableId , queries);
            
            return{data: response.documents || [] , error:null};
        }
        catch (error) {
            console.error("Error listing documents: ", error);
            return error.message;
        }
    },

    // Create document
    async createDocument (dbId, tableId, data , id = null){
        try {
            return await database.createDocument(dbId, tableId, id || undefined , data);
        } catch (error) {
            console.error("Error creating document: ", error);
            return error.message;
        }
    },

    // update document
    async updateDocument (dbId, tableId, id, data){
        try {
            return await database.updateDocument(dbId, tableId, id , data);
        } catch (error) {
            console.error("Error updating document: ", error.message);
            return { error: error.message };
        }
    },

    // delete document
    async deleteDocument (dbId, tableId, id){
        try {
             await database.deleteDocument(dbId, tableId, id);
             return { success: true };
        } catch (error) {
            console.error("Error deleting document: ", error.message);
            return { error: error.message };
        }
    }
}

export default databaseService;
