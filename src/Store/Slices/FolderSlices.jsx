import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db, storage } from '../../firebase'; // Проверьте правильность пути
import { collection, getDocs } from 'firebase/firestore';
import { ref, listAll } from 'firebase/storage';

export const fetchFoldersFromFirestore = createAsyncThunk('folders/fetchFoldersFromFirestore', async () => {
    const foldersCollection = collection(db, 'folders');
    const folderSnapshot = await getDocs(foldersCollection);
    const folderList = folderSnapshot.docs.map(doc => doc.data().name);
    return Array.from(new Set(folderList));
});

export const fetchFoldersFromStorage = createAsyncThunk('folders/fetchFoldersFromStorage', async () => {
    const listRef = ref(storage, '');
    const res = await listAll(listRef);
    return res.prefixes.map(folderRef => folderRef.name);
});

const folderSlice = createSlice({
    name: 'folders',
    initialState: {
        folders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoldersFromStorage.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFoldersFromStorage.fulfilled, (state, action) => {
                state.loading = false;
                state.folders = action.payload;
            })
            .addCase(fetchFoldersFromStorage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Экспортируем редюсер
export default folderSlice.reducer;
