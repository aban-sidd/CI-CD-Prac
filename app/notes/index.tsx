import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NoteItem from "@/components/NoteItem";
import AddNoteModal from "@/components/AddNoteModal";
import noteService from "@/services/noteService";
import { useAuth } from "@/context/authContext";
import { Keyboard, Platform } from "react-native";


export default function NotesScreen() {

  type Note = {
    $id: string;
    text: string;
  };

  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<String | null> (null);

  const {user, loading: authLoading} = useAuth();
  const router = useRouter();



// inside NotesScreen
const [keyboardHeight, setKeyboardHeight] = useState(0);

useEffect(() => {
  const showSub = Keyboard.addListener(
    Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
    (e) => setKeyboardHeight(e.endCoordinates.height)
  );
  const hideSub = Keyboard.addListener(
    Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
    () => setKeyboardHeight(0)
  );

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);




  useEffect(() => {
    if (!authLoading && !user){
      router.replace('/auth');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user){
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    setLoading(true);
    const response = await noteService.getNotes(user.$id);

    if (response.error) {
      setError(response.error);
      Alert.alert("Error", response.error);
    } else {
      setNotes(response.data);
      setError(null);
    }

    setLoading(false);
  };

  const addNote = async () => {
    if (newNote.trim() === "") return;

    const response = await noteService.addNote(user.$id , newNote);

    if (response.error) {
      Alert.alert("Error", response.error);
      return;
    } else {
      setNotes([...notes, response.data]);
    }

    setNewNote("");
    setModalVisible(false);
  };

  const deleteNote = async (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const response = await noteService.deleteNote(id);
          if (response.error) {
            Alert.alert("Error", response.error);
            return;
          } else {
            setNotes(notes.filter((note) => note.$id !== id));
          }
        },
      },
    ]);
  };

  const editNote = async (id , newText) => {
    if (!newText.trim()){
        Alert.alert("Error", "Note text cannot be empty");
        return;
    }
        setEditingNoteId(id);
    try {
    const response = await noteService.updateNote(id, newText);
    if (response.error) {
      Alert.alert("Error", response.error);
      return;
    }else {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.$id === id ? {...note, text: response.data.text} : note
            )
        );
    } 
  } catch(error) {
    Alert.alert("Error", "An unexpected error occurred");
  } finally {
    setEditingNoteId(null);
  }

  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Wrap list in KeyboardAwareScrollView */}
          {notes.length === 0 ? (
             <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Create notes</Text>
    </View>
          ) : (

<KeyboardAwareFlatList
  data={notes}
  keyExtractor={(item) => item.$id}
  renderItem={({ item }) => (
    <NoteItem
      note={item}
      onDelete={deleteNote}
      onEdit={editNote}
      isEditing={editingNoteId === item.$id}
      isLocked={editingNoteId != null && editingNoteId !== item.$id}
      setEditingNoteId={setEditingNoteId}
    />
  )}
  enableOnAndroid={true}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="interactive"
  extraScrollHeight={60}
  keyboardOpeningTime={250}
  contentContainerStyle={{
    paddingTop: 10,
    paddingBottom:keyboardHeight > 0 ? Math.max(keyboardHeight * 0.58, 80) : 80,  // 👈 shifts only when keyboard is open
  }}
  showsVerticalScrollIndicator={false}
/>
          )}
          
        </>
      )}

      {/* Floating button */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNote={newNote}
        setNewNote={setNewNote}
        addNote={addNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 50,
},
emptyText: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#888",
},
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
});
