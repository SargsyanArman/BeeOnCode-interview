import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(sessionStorage.getItem('user'));

const initialState = {
  email: savedUser?.email || null,
  token: savedUser?.token || null,
  id: savedUser?.id || null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      sessionStorage.setItem('user', JSON.stringify({
        email: action.payload.email,
        token: action.payload.token,
        id: action.payload.id,
      }));
    },
    removeUser: (state) => {
      state.email = null;
      state.token = null;
      state.id = null;
      sessionStorage.removeItem('user');
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
