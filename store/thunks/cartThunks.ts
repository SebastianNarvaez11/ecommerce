import Cookie from "js-cookie";
import { IShippingAddress } from "../../interfaces";
import { AppDispatch } from "../store";
import { update_address } from "../slices/cartSlice";

export const updateAddress = (address: IShippingAddress) => async (dispatch: AppDispatch) => {

    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);

    dispatch(update_address(address))
}