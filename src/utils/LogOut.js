import { emptyCart } from "../reducers/CartSlice.js"
import { logout } from '../reducers/SessionSlice';

function logOut(dispatch) {
    //hapus acces token dan refresh token
    dispatch(logout());
    dispatch(emptyCart());
}

export default logOut;