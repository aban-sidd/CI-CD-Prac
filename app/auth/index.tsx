import { View , Text , TouchableOpacity , TextInput , StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {useAuth} from '@/context/authContext'

export default function AuthScreen() {

    const { login , register } = useAuth();
    const router = useRouter();
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [confirmPassword , setConfirmPassword] = useState('');
    const [isRegistering , setIsRegistering] = useState(false);
    const [error , setError] = useState('');

    const handleAuth = async () => {
        if (!email.trim() || !password.trim()){
            setError('Email and Password are required.');
            return;
        }

        if (isRegistering && password !== confirmPassword){
            setError('Passwords do not match.');
            return;
        }

        let response;

        if (isRegistering){
            response = await register(email, password);
        } else{
            response = await login(email, password)
        }

        if (response?.error){
            Alert.alert("Error" ,response.error);
        }

        router.replace('/notes');

    }
    
    return (

        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding': 'height'}>

            <ScrollView contentContainerStyle = {styles.scrollContainer} keyboardShouldPersistTaps="handled">

            
        <View style={styles.container}>
            <Text style={styles.header}> {isRegistering ? 'Sign-Up' : 'Login'} </Text>
            {error ? <Text style={styles.error} > {error } </Text> : null}

            <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={'#aaa'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            />

            <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={'#aaa'}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            textContentType="none"
            />

            {isRegistering && (
                <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={'#aaa'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                secureTextEntry
                textContentType="none"
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={styles.buttonText} > {isRegistering ? 'Sign-Up' : 'Login'} </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                <Text style={styles.switchText} >
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign-Up"}
                </Text>
            </TouchableOpacity>

        </View>

        </ScrollView>

        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    marginTop: 10,
    color: '#007bff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
  },
})