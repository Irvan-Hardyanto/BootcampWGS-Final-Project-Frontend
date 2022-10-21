import { createSlice } from "@reduxjs/toolkit";

//nilai awal state
const initialState={
    value:[]
}

//FORMAT 'STATE' nya:
// product: {
//     id
//     image 
//     name 
//     price
//     quantity
//     unit
//     checked
// }
export const cartSlice=createSlice({
    name:'cartReducer',
    initialState,
    reducers:{
        addProducts: (state,action)=>{
            state.value=[...(state.value),...(action.payload.products)];
        },
        addProduct: (state,action)=>{
            const find = state.value.find(cartItem=>{
                return cartItem.id === parseInt(action.payload.product.id);
            });
            if(!find){
                state.value.push(action.payload.product);
            }else{
                state.value.find((product)=>product.id===action.payload.product.id).quantity+=action.payload.product.quantity;
            }
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
        editPurchaseQuantity: (state,action)=>{
            state.value.find((product)=>product.id===action.payload.id).quantity=action.payload.quantity
        },
        checkProduct:(state,action)=>{
            state.value.find(product=>product.id===action.payload.id).checked=true;
        },
        uncheckProduct:(state,action)=>{
            state.value.find(product=>product.id===action.payload.id).checked=false;
        },
        removeProduct: (state,action)=>{
            state.value=state.value.filter((product)=>{
                return !(product.id===action.payload.id)
            })
        }
    }
})
export const {addProducts,addProduct,removeProduct,checkAllProduct,uncheckAllProduct,checkProduct,uncheckProduct,editPurchaseQuantity} = cartSlice.actions;
export default cartSlice.reducer;