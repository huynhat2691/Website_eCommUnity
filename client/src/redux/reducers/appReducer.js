const initialState = {
  refreshCounter: 0
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'refreshApp':
      return {
        ...state,
        refreshCounter: state.refreshCounter + 1
      };
    default:
      return state;
  }
};

export default appReducer;