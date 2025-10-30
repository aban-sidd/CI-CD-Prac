import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NoteItem({ note, onDelete, onEdit, isEditing , isLocked, setEditingNoteId }) {

//   const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);
  const inputRef = useRef(null);

  const handleSave = () => {
    if (editedText.trim() === "") return;
    onEdit(note.$id, editedText);
    setEditingNoteId(null);
  };

  const handleShowFullText = () => {
    Alert.alert("Note", note.text, [{ text: "OK" }]);
  };

  return (
    <View style={styles.noteItem}>
      {isEditing ? (
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={editedText}
          onChangeText={setEditedText}
          autoFocus
          onSubmitEditing={handleSave}
          returnKeyType="done"
        />
      ) : (
        <TouchableOpacity onPress={handleShowFullText} style={{ flex: 1 }}>
          <Text
            style={styles.noteText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {note.text}
          </Text>
        </TouchableOpacity>
      )}

      {/* Actions container */}
      <View style={styles.actions}>
        {isEditing ? (
          <TouchableOpacity
            onPress={() => {
              handleSave();
              inputRef.current?.blur();
            }}
          >
            <Text style={styles.save}>💾</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setEditingNoteId(note.$id)} disabled={isLocked}>
            <Text style={[styles.edit, isLocked && {opacity:0.4}]}>✏️</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => onDelete(note.$id)} disabled={!isEditing && isLocked}>
          <Text style={[styles.delete, isLocked && !isEditing && {opacity:0.4}] }>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 6,
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  edit: {
    fontSize: 18,
    marginRight: 12,
  },
  save: {
    fontSize: 18,
    color: "green",
    marginRight: 12,
  },
  delete: {
    fontSize: 18,
    color: "red",
  },
});
