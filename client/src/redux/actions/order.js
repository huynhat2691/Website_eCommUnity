import axios from "axios";
import { server } from "../../server";

// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );

    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFail",
      payload: error.response.data.message,
    });
  }
};

// get all orders of shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-all-seller-orders/${shopId}`
    );

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFail",
      payload: error.response.data.message,
    });
  }
};

// get all orders for admin
export const getAllOrdersAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersAdminRequest",
    });

    const { data } = await axios.get(`${server}/order/admin-get-all-orders`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllOrdersAdminSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersAdminFail",
      payload: error.response.data.message,
    });
  }
};

export const markCancelledOrdersAsViewed =
  (orderIds) => (dispatch, getState) => {
    dispatch({
      type: "markCancelledOrdersAsViewed",
      payload: orderIds,
    });

    const { viewedCancelledOrders } = getState().order;
    localStorage.setItem(
      "viewedCancelledOrders",
      JSON.stringify(viewedCancelledOrders)
    );
  };

// get all orders of admin
export const getAllAdminOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllAdminOrdersRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-all-admin-orders`
    );

    dispatch({
      type: "getAllAdminOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllAdminOrdersFail",
      payload: error.response.data.message,
    });
  }
};