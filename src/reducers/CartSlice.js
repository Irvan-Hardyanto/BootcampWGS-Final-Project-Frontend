import { createSlice } from "@reduxjs/toolkit";

//nilai awal state
const initialState={
    value:[]
}
export const cartSlice=createSlice({
    name:'cartReducer',
    initialState,
    reducers:{
        addProduct: (state,action)=>{
            state.value.push(action.payload.product);
        },
        checkAllProduct: (state,action)=>{
            for(let product of state.value){
                product.checked=true;
            }
        },
        uncheckAllProduct: (state,action)=>{
            for(let product of state.value){
                product.checked=false;
            }
        },
        checkProduct:(state,action)=>{
            state.value.find(product=>product.id===action.payload.id).checked=true;
        },
        uncheckProduct:(state,action)=>{
            state.value.find(product=>product.id===action.payload.id).checked=false;
        },
        removeProduct: (state,action)=>{
            state.value=state.value.filter((product)=>{
                return !product.id===action.payload.id
            })
        }
    }
})
export const {addProduct,removeProduct,checkAllProduct,uncheckAllProduct,checkProduct,uncheckProduct} = cartSlice.actions;
export default cartSlice.reducer;