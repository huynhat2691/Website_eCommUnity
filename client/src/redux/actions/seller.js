import { server } from "../../server";
import axios from "axios";

// get all sellers for admin
export const getAllSellersAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellersAdminRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-get-all-sellers`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllSellersAdminSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSellersAdminRequest",
      payload: error.response.data.message,
    });
  }
};

export const getShopDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getShopDetailsRequest" });
    const { data } = await axios.get(`${server}/shop/get-shop-info/${id}`);
    dispatch({
      type: "getShopDetailsSuccess",
      payload: data.shop,
    });
  } catch (error) {
    dispatch({
      type: "getShopDetailsFail",
      payload: error.response.data.message,
    });
  }
};

export const logoutSeller = () => async (dispatch) => {
  try {
    await axios.get(`${server}/shop/logout-shop`, {
      withCredentials: true,
    });
    dispatch({ type: "sellerLogoutSuccess" });
  } catch (error) {
    dispatch({
      type: "sellerLogoutFail",
      payload: error.response?.data?.message || "Logout failed",
    });
  }
};

// get admin shop
export const getAdminShop = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAdminShopRequest",
    });

    const { data } = await axios.get(`${server}/shop/getAdminShop`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAdminShopSuccess",
      payload: data.shop,
    });
  } catch (error) {
    dispatch({
      type: "getAdminShopFail",
      payload: error.response.data.message,
    });
  }
};
