import { createAction, handleActions } from 'redux-actions';

// actions types
const CHANGE_INPUT = 'CHANGE_INPUT';

// action creator
export const changeInput = createAction(CHANGE_INPUT, value => value);

// reducer
const initialState = '';

export default handleActions(
  {
    [CHANGE_INPUT]: (state, action) => action.payload
  },
  initialState
);
