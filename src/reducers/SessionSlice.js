import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userId:null,
    fullname:'',
    email:'',
    mobile:'',
    picture:null,
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
            state.fullname=action.payload.fullname;
            state.email=action.payload.email;
            state.mobile=action.payload.mobile;
            state.picture=action.payload.picture;
            state.role=action.payload.role;
            state.accessToken=action.payload.accessToken;
            state.refreshToken=action.payload.refreshToken;
        },
        logout: (state,action)=>{
            state.userId=null;
            state.fullname='';
            state.email='';
            state.mobile='';
            state.picture=null;
            state.role=null;
            state.accessToken=null;
            state.refreshToken=null;
        }
    }
})

export const {login,logout} = sessionSlice.actions;
export default sessionSlice.reducer;