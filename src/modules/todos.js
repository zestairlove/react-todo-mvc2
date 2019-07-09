import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';

import * as api from '../lib/api';

// actions types
const INIT_TODOS_PENDING = 'INIT_TODOS_PENDING';
const INIT_TODOS_SUCCESS = 'INIT_TODOS_SUCCESS';
const INIT_TODOS_FAILURE = 'INIT_TODOS_FAILURE';
const INSERT_TODO_PENDING = 'INSERT_TODO_PENDING';
const INSERT_TODO_SUCCESS = 'INSERT_TODO_SUCCESS';
const INSERT_TODO_FAILURE = 'INSERT_TODO_FAILURE';

// action creator
const initTodosPending = createAction(INIT_TODOS_PENDING);
const initTodosSuccess = createAction(INIT_TODOS_SUCCESS, todos => todos);
const initTodosFailure = createAction(INIT_TODOS_FAILURE, err => err);
export const initTodos = () => dispatch => {
  dispatch(initTodosPending());
  console.log('initTodos start');

  return api.fetchTodos().then(res => {
    const { data } = res;
    const initialTodos = Object.keys(data).reduce((acc, key) => {
      acc.push({ id: key, text: data[key].text, isDone: data[key].isDone });
      return acc;
    }, []);

    dispatch(initTodosSuccess(initialTodos));
    console.log('initTodos complete');
  })
  .catch(err => {
    dispatch(initTodosFailure(err));
    console.log('initTodos fail');
    throw err;
  });
};

const insertTodoPending = createAction(INSERT_TODO_PENDING, input => input);
const insertTodoSuccess = createAction(INSERT_TODO_SUCCESS, id => id);
const insertTodoFailure = createAction(INSERT_TODO_FAILURE, err => err);
export const insertTodo = () => (dispatch, getState) => {
  dispatch(insertTodoPending());
  console.log('insertTodo start');

  return api.insertTodo(getState().input)
    .then(res => {
      dispatch(insertTodoSuccess(res.data.name));
      console.log('insertTodo success');
    })
    .catch(err => {
      dispatch(insertTodoFailure(err));
      console.log('insertTodo fail');
    });
};

// reducer
const initialState = {
  todos: [],
  editingId: null,
  pending: false,
  error: false
};

export default handleActions(
  {
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
