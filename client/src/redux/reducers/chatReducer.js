// redux/reducers/chatReducer.js
import {
  TOGGLE_CHAT_POPUP,
  SET_CURRENT_CONVERSATION,
} from "../actions/chatActions";

const initialState = {
  isOpen: false,
  currentConversation: null,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_CHAT_POPUP:
      return { ...state, isOpen: !state.isOpen };
    case SET_CURRENT_CONVERSATION:
      return { ...state, currentConversation: action.payload };
    default:
      return state;
  }
};
