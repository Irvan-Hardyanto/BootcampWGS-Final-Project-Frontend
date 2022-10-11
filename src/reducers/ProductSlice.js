import { createSlice } from "@reduxjs/toolkit";

//nilai awal state
const initialState={
    value:[]
};

//buat reducer untuk state tertentu
export const productSlice = createSlice({
    name:'productReducer',
    initialState,
    reducers:{
        initProducts: (state,action)=>{
            state.value=action.payload.products
        }
    }
})

export const {initProducts} = productSlice.actions;
export default productSlice.reducer;