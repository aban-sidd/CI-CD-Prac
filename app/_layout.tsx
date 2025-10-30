import { Stack } from "expo-router";
import {AuthProvider , useAuth} from '../context/authContext'
import { TouchableOpacity , Text , StyleSheet } from "react-native";

const HeaderLogout = () => {
  const {user , logout} = useAuth();

  return user ? (
    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  ) : null;
}

export default function RootLayout() {
  return (
  <AuthProvider>
  
  <Stack 
  screenOptions={{
    headerStyle: {backgroundColor: 'orange'},
    headerTintColor: 'white',
    headerTitleAlign: 'center',
    headerTitleStyle: {fontWeight: 'bold', fontSize: 20},

    

    contentStyle: {paddingHorizontal: 10 , paddingTop: 10 , backgroundColor: 'white'}
  }}>
    <Stack.Screen name="index" options={{title: 'Home'}}/>
    <Stack.Screen name="notes" options={{headerTitle: 'Notes' , headerRight: ()=> <HeaderLogout/>, headerBackVisible: false , gestureEnabled:false}}/>
    <Stack.Screen name="auth" options={{headerTitle: 'Login'}}/>
    
    </Stack>;

    </AuthProvider>
)
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
