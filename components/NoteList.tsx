import { FlatList, View } from "react-native";
import NoteItem from "./NoteItem";
import { useState } from "react";

 

export default function NoteList( { notes , onDelete , onEdit} ){

      const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

    return (
        <View>
             <FlatList 
                        data={notes}
                         keyExtractor={(item) => item.$id}
                         renderItem={({item}) => <NoteItem note={item} 
                         onDelete={onDelete} 
                         onEdit={onEdit}
                         isEditing={editingNoteId === item.$id}
                         isLocked={editingNoteId != null && editingNoteId !== item.$id}
                         setEditingNoteId={setEditingNoteId}
                         />} 
                         />
        </View>
    )
}