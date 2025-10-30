// noteService.js
import { ID , Query} from "react-native-appwrite";
import databaseService from "./databaseService";

const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const tableId = process.env.EXPO_PUBLIC_APPWRITE_TABLE_NOTES_ID;

const noteService = {
    // Fetch notes
    async getNotes(user_id) {

        if(!user_id){
            console.error("Error: Missing user_id in getNotes");
            return {
                data : [],
                error: 'user_id is missing'
                };
            }

        try {
            const response = await databaseService.listDocuments(dbId, tableId , [
                Query.equal('user_id', user_id)
            ]);

            const documents = response.data || []; 

           return {
        data: documents.map((doc) => ({
          $id: doc.$id,
          text: doc.text ?? "",
          user_id: doc.user_id,
        })),
        error: null,
      };
        } catch (error) {
            console.log('Error fetching notes:', error.message);
              return { data: [], error: error.message };
        }
    },

    // Add note

    async addNote (user_id, text) {
        if (!text){
            return { error: "Note text cannot be empty." };
        }

        const data = {
            text: text,
            user_id: user_id,
        }

        const response = await databaseService.createDocument(dbId, tableId, data , ID.unique());

        if (response.error) {
            return { error: response.error };
        }

         return {
      data: {
        $id: response.$id,
        text: response.text,
        user_id: response.user_id,
      },
    };
    },

    // update note

    async updateNote (id, text) {
        const response = await databaseService.updateDocument(dbId, tableId, id, {text});
        if (response.error) {
            return { error: response.error };
        }
        return { data: response};
        },


    // Delete note

    async deleteNote (id) {
        if (!id){
            return { error: "Note ID is required for deletion." };
        }
        const response = await databaseService.deleteDocument(dbId, tableId, id);
        if (response.error) {
            return { error: response.error };
        }
        return { success: true};
    },
};

export default noteService;
