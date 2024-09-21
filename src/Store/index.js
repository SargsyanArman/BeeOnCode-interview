import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/UserSlices";
import folderReducer from './Slices/FolderSlices'

export const store = configureStore({
  reducer: {
    user: userReducer,
    folders: folderReducer,
  },
});
