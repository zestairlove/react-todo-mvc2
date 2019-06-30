import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';

import * as api from '../lib/api';

// actions types
const CHANGE_INPUT = 'CHANGE_INPUT';
const INIT_TODOS_PENDING = 'INIT_TODOS_PENDING';
const INIT_TODOS_SUCCESS = 'INIT_TODOS_SUCCESS';
const INIT_TODOS_FAILURE = 'INIT_TODOS_FAILURE';

// action creator
export const changeInput = createAction(CHANGE_INPUT, value => value);
const initTodosPending = createAction(INIT_TODOS_PENDING);
const initTodosSuccess = createAction(INIT_TODOS_SUCCESS, todos => todos);
const initTodosFailure = createAction(INIT_TODOS_FAILURE, err => err);
export const initTodos = () => dispatch => {
  dispatch(initTodosPending());
  console.log('init todo start');

  return api.fetchTodos().then(res => {
    const { data } = res;
    const initialTodos = Object.keys(data).reduce((acc, key) => {
      acc.push({ id: key, text: data[key].text, isDone: data[key].isDone });
      return acc;
    }, []);

    dispatch(initTodosSuccess(initialTodos));
    console.log('init todo complete');
  })
  .catch(err => {
    dispatch(initTodosFailure(err));
    console.log('init todo fail');
    throw err;
  });
};


// reducer
const initialState = {
  input: '',
  todos: [],
  editingId: null,
  pending: false,
  error: false
};

export default handleActions(
  {
    [CHANGE_INPUT]: (state, action) => {
      const { payload: input } = action;

      return produce(state, draft => {
        draft.input = input;
      });
    },
    [INIT_TODOS_PENDING]: (state, action) => {
      return produce(state, draft => {
        draft.pending = true;
        draft.error = false;
      });
    },
    [INIT_TODOS_SUCCESS]: (state, action) => {
      const { payload: todos } = action;
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
      });
    },
    [INIT_TODOS_FAILURE]: (state, action) => {
      const { payload: err } = action;
      console.error(err);
      return produce(state, draft => {
        draft.pending = false;
        draft.error = true;
      });
    },
  },
  initialState
);
