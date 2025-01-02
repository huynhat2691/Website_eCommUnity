import axios from "axios";
import { server } from "../../server";

// add event
export const addEvent = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "AddEventRequest",
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(
      `${server}/event/add-event`,
      newForm,
      config
    );

    dispatch({
      type: "AddEventSuccess",
      payload: data.event,
    });
  } catch (error) {
    dispatch({
      type: "AddEventFail",
      payload: error.response.data.message,
    });
  }
};

export const resetAddEventSuccess = () => ({
  type: "resetAddEventSuccess",
});

// get all events shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllEventsShopRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);

    dispatch({
      type: "getAllEventsShopSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAllEventsShopFail",
      payload: error.response?.data?.message,
    });
  }
};

// shop delete event
export const shopDeleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "shopDeleteEventRequest",
    });
    const { data } = await axios.delete(`${server}/event/delete-event/${id}`, {
      withCredentials: true,
    });
    dispatch({
      type: "shopDeleteEventSuccess",
      payload: { message: data.message, id: id },
    });
    // Sau khi xóa thành công, gọi lại action để lấy danh sách event mới
    dispatch(getAllEventsShop(data.shop._id));
  } catch (error) {
    dispatch({
      type: "shopDeleteEventFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// admin delete event
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteEventRequest",
    });
    const { data } = await axios.delete(`${server}/event/delete-event/${id}`, {
      withCredentials: true,
    });
    dispatch({
      type: "deleteEventSuccess",
      payload: { message: data.message, id: id },
    });
  } catch (error) {
    dispatch({
      type: "deleteEventFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllEventsRequest",
    });
    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({
      type: "getAllEventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAllEventsFail",
      payload: error.response.data.message,
    });
  }
};

// get all events for admin
export const adminGetAllEvents = () => async (dispatch) => {
  try {
    dispatch({
      type: "adminGetAllEventsRequest",
    });

    const { data } = await axios.get(`${server}/event/admin-get-all-events`);

    dispatch({
      type: "adminGetAllEventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "adminGetAllEventsFail",
      payload: error.response?.data?.message || "An error occurred",
    });
  }
};

// add event for admin
export const adminAddEvent = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "AdminAddEventRequest",
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post(
      `${server}/event/admin-add-event`,
      newForm,
      config
    );

    dispatch({
      type: "AdminAddEventSuccess",
      payload: data.event,
    });
  } catch (error) {
    dispatch({
      type: "AdminAddEventFail",
      payload: error.response.data.message,
    });
  }
};

export const resetAdminAddEventSuccess = () => ({
  type: "resetAdminAddEventSuccess",
});

// get all events admin
export const getAllEventsAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllEventsAdminRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events-admin`);

    dispatch({
      type: "getAllEventsAdminSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAllEventsAdminFail",
      payload: error.response?.data?.message,
    });
  }
};