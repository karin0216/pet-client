import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const { REACT_APP_SERVER_URL } = process.env;

const initialState = {
  isLoggedIn: false,
  isSuccess: false, 
  username: null,
  email: null,
  password: null,
  description: null,
  profile_picture: null,
  type: null,
};

export const validation = createAsyncThunk(
  "signUp/validate",
  async (firstInfo) => {
    try {
      const response = await axios.post(`${REACT_APP_SERVER_URL}/auth/validation`, firstInfo);
      return response.data;
    } catch (err) {
      return { err: err.response.data };
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (signUpInput) => {
    try {
      const response = await axios.post(`${REACT_APP_SERVER_URL}/auth/sign-up`, signUpInput);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      return { err: err.response.data };
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (signInInput) => {
    try {
      const response = await axios.post(`${REACT_APP_SERVER_URL}/auth/sign-in`, signInInput);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      return { err: err.response.data };
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getType: (state, action) => { state.type = action.payload },
    getUserName: (state, action) => { state.username = action.payload.username },
    getDescription: (state, action) => { state.description = action.payload.description },
    getProfilePicture: (state, action) => { state.profile_picture = action.payload.profile_picture },
  },
  extraReducers: {
    [validation.fulfilled]: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    [signUp.fulfilled]: (state, action) => {
      if (action.payload.user) {
        state.isSuccess = true;
      }
    },
    [signIn.fulfilled]: (state, action) => {
      if (action.payload.user) {
        state.isLoggedIn = true;
      }
    },
  },
});

export const { getUserName, getDescription, getProfilePicture, getType } = userSlice.actions;
export default userSlice.reducer;

