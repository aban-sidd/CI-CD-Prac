import { Alert } from 'react-native';
import {account} from './appwrite';
import { ID } from 'react-native-appwrite';


const authService = {
    
// register a new user

async register(email , password){

    try{
        const response = await account.create(ID.unique(), email, password);
        return response;
    } catch (error){
        return {
            error: error.message || 'Registration failed'
        }
    }
},

// Login 

async login (email, password){

     if (password.length < 8) {
        Alert.alert("Error", "Invalid Email or Password.");
        return;
            }
    try {
        const response = await account.createEmailPasswordSession(email, password);
        return response;
    } catch (error) {
        return{
            error: error.message || 'Login failed'
        }
    }
},

// logged in

async getUser(){
    try {
        return await account.get();
    } catch (error) {
        return null;
    }
},

// logout

async logout(){
    try {
        return await account.deleteSession('current');
    } catch (error){
        return {
            error: error.message || 'Logout failed'
        }
    }
},

}

export default authService;