import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from "../Pages/features/authenticationSlice/authenticationSlice";



export const store = configureStore({

    reducer:{
        authentication: authenticationSlice
    }
})