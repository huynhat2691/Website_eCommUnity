// redux/actions/chatActions.js
export const TOGGLE_CHAT_POPUP = 'TOGGLE_CHAT_POPUP';
export const SET_CURRENT_CONVERSATION = 'SET_CURRENT_CONVERSATION';

export const toggleChatPopup = () => ({
  type: TOGGLE_CHAT_POPUP
});

export const setCurrentConversation = (conversation) => ({
  type: SET_CURRENT_CONVERSATION,
  payload: conversation
});
