import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../Services/api";

export const userRegister = createAsyncThunk("/register", async (data, thunkAPI)=>{
    try {
        let response = await api.post('/users/register', data);
        console.log(response, 'RESPONSE FROM USER REGISTER THUNK')
        return response.data.data;
    } catch (error) {
        console.log(error, "Error in register async thunk")
        return thunkAPI.rejectWithValue(error || "Error in Register Thunk")
    }
})

export const userLogin = createAsyncThunk('/login', async (credentials, thunkAPI)=>{
    try {
        let response = await api.post('/users/login', credentials);
        console.log(response.data.data, "RESPONSE FROM USER LOGIN THUNK");
        return response.data.data;
    } catch (error) {
        console.log(error, "Error in login async thunk")
        return thunkAPI.rejectWithValue(error || "Error in Login Thunk")
    }
})

export const getMe = createAsyncThunk('/getMe', async (__, thunkAPI )=>{
    try {
        
        let response = await api.get('/users/me');
        console.log(response, "Data from getMe controller")
        return response.data.data;

    } catch (error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.response.data || "Error in getMe async thunk")
    }
})

let initialState = {
    loading: false,
    searchQuery: '', 
    user: null,
    token: localStorage.getItem('token') || null,
    error: null
}


export const authenticationSlice = createSlice({
    name: "authenticationSlice",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        logout: (state)=>{
            localStorage.removeItem('token');
            state.token = null;
            state.user = null; 
            state.searchQuery = '';
        }
    },
    extraReducers: (builder)=>{
        // Register Cases
        builder.addCase(userRegister.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        builder.addCase(userRegister.fulfilled, (state)=>{
            state.loading = false;
        })
        builder.addCase(userRegister.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        // Login Cases
        builder.addCase(userLogin.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        builder.addCase(userLogin.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        })
        builder.addCase(userLogin.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })

        // Get Me Cases
        builder.addCase(getMe.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        builder.addCase(getMe.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload; 
        })
        builder.addCase(getMe.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        })
    }
})

export const { setSearchQuery, logout } = authenticationSlice.actions; 
export default authenticationSlice.reducer;