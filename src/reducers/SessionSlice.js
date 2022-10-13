import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userId:null,
    role:null,
    accessToken:null,
    refreshToken:null
};

export const sessionSlice = createSlice({
    name:'sessionReducer',
    initialState,
    reducers:{
        login: (state,action)=>{
            state.userId=action.payload.userId;
            state.role=action.payload.role;
            state.accessToken=action.payload.accessToken;
            state.refreshToken=action.payload.refreshToken;
        },
        logout: (state,action)=>{
            state.userId=null;
            state.role=null;
            state.accessToken=null;
            state.refreshToken=null;
        }
    }
})

export const {login,logout} = sessionSlice.actions;
export default sessionSlice.reducer;