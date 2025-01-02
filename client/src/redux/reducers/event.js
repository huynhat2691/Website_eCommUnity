import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const eventReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("AddEventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("AddEventSuccess", (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.success = true;
    })
    .addCase("AddEventFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // reset add evemt success
    .addCase("resetAddEventSuccess", (state) => {
      state.success = false;
    })

    // get all events shop
    .addCase("getAllEventsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllEventsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
    })
    .addCase("getAllEventsShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // shop delete event
    .addCase("shopDeleteEventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("shopDeleteEventSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
      state.events = state.events.filter(
        (event) => event._id !== action.payload.id
      );
    })
    .addCase("shopDeleteEventFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // admin delete product
    .addCase("deleteEventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteEventSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message;
      state.allEvents = state.allEvents.filter(
        (event) => event._id !== action.payload.id
      );
    })
    .addCase("deleteEventFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // admin get all events
    .addCase("getAllEventsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllEventsSuccess", (state, action) => {
      state.isLoading = false;
      state.allEvents = action.payload;
    })
    .addCase("getAllEventsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // admin get all events
    .addCase("adminGetAllEventsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("adminGetAllEventsSuccess", (state, action) => {
      state.isLoading = false;
      state.adminAllEvents = action.payload;
    })
    .addCase("adminGetAllEventsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // admin add event
    .addCase("AdminAddEventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("AdminAddEventSuccess", (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.success = true;
    })
    .addCase("AdminAddEventFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // reset admin add event success
    .addCase("resetAdminAddEventSuccess", (state) => {
      state.adminSuccess = false;
    })

    // get all events admin
    .addCase("getAllEventsAdminRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllEventsAdminSuccess", (state, action) => {
      state.isLoading = false;
      state.adminEvents = action.payload;
    })
    .addCase("getAllEventsAdminFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
