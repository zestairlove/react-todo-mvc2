import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

import * as api from '../lib/api';

// actions types
const INIT_TODOS_PENDING = 'INIT_TODOS_PENDING';
const INIT_TODOS_SUCCESS = 'INIT_TODOS_SUCCESS';
const INIT_TODOS_FAILURE = 'INIT_TODOS_FAILURE';
const INSERT_TODO_PENDING = 'INSERT_TODO_PENDING';
const INSERT_TODO_SUCCESS = 'INSERT_TODO_SUCCESS';
const INSERT_TODO_FAILURE = 'INSERT_TODO_FAILURE';
const REMOVE_TODO_PENDING = 'REMOVE_TODO_PENDING';
const REMOVE_TODO_SUCCESS = 'REMOVE_TODO_SUCCESS';
const REMOVE_TODO_FAILURE = 'REMOVE_TODO_FAILURE';
const TOGGLE_TODO_PENDING = 'TOGGLE_TODO_PENDING';
const TOGGLE_TODO_SUCCESS = 'TOGGLE_TODO_SUCCESS';
const TOGGLE_TODO_FAILURE = 'TOGGLE_TODO_FAILURE';
const TOGGLE_ALL_PENDING = 'TOGGLE_ALL_PENDING';
const TOGGLE_ALL_SUCCESS = 'TOGGLE_ALL_SUCCESS';
const TOGGLE_ALL_FAILURE = 'TOGGLE_ALL_FAILURE';

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

const insertTodoPending = createAction(INSERT_TODO_PENDING, todo => todo);
const insertTodoSuccess = createAction(INSERT_TODO_SUCCESS, id => id);
const insertTodoFailure = createAction(INSERT_TODO_FAILURE, ({ todos, err }) => ({ todos, err }));
export const insertTodo = () => (dispatch, getState) => {
  const { inputData: input, todoData: { todos } } = getState();
  const tempId = 'temp_' + Date.now();
  const tempTodo = { id: tempId, text: input, isDone: false };

  dispatch(insertTodoPending(tempTodo));
  console.log('insertTodo start');

  return api.insertTodo(input)
    .then(res => {
      dispatch(insertTodoSuccess(res.data.name));
      console.log('insertTodo success');
    })
    .catch(err => {
      dispatch(insertTodoFailure({ todos, err }));
      console.log('insertTodo fail');
    });
};

const removeTodoPending = createAction(REMOVE_TODO_PENDING, idx => idx);
const removeTodoSuccess = createAction(REMOVE_TODO_SUCCESS);
const removeTodoFailure = createAction(REMOVE_TODO_FAILURE, ({ todos, err }) => ({ todos, err }));
export const removeTodo = id => (dispatch, getState) => {
  const { todoData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);

  dispatch(removeTodoPending(idx));
  console.log('removeTodo start');

  return api.removeTodo(id)
    .then(res => {
      dispatch(removeTodoSuccess());
      console.log('removeTodo complete');
    })
    .catch(err => {
      dispatch(removeTodoFailure({ todos, err }));
      console.log('removeTodo fail');
    });
};

const toggleTodoPending = createAction(TOGGLE_TODO_PENDING, idx => idx);
const toggleTodoSuccess = createAction(TOGGLE_TODO_SUCCESS);
const toggleTodoFailure = createAction(TOGGLE_TODO_FAILURE, ({ idx, err }) => ({ idx, err }));
export const toggleTodo = id => (dispatch, getState) => {
  const { todoData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);
  const nextIsDone = !todos[idx].isDone;

  dispatch(toggleTodoPending(idx));
  console.log('toggleTodo start');
 
  api.patchTodo(id, { isDone: nextIsDone })
    .then(res => {
      dispatch(toggleTodoSuccess());
      console.log('toggleTodo complete');
    })
    .catch(err => {
      dispatch(toggleTodoFailure({ idx, err }));
      console.log('toggleTodo failure');
    });
};

const toggleAllPending = createAction(TOGGLE_ALL_PENDING, nextIsDone => nextIsDone);
const toggleAllSuccess = createAction(TOGGLE_ALL_SUCCESS);
const toggleAllFailure = createAction(TOGGLE_ALL_FAILURE, ({ todos, err }) => ({ todos, err }));
export const toggleAll = () => (dispatch, getState) => {
  const { todoData: { todos } } = getState();
  const nextIsDone = todos.some(todo => !todo.isDone);

  dispatch(toggleAllPending(nextIsDone));
  console.log('toggleAll start');

  const axiArray = todos.map(todo =>
    api.patchTodo(todo.id, { isDone: nextIsDone })
  );

  axios.all(axiArray)
    .then(res => {
      dispatch(toggleAllSuccess());
      console.log('toggleAll complete');
    })
    .catch(err => {
      dispatch(toggleAllFailure({ todos, err }));
      console.log('toggleAll fail');
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
    [INSERT_TODO_PENDING]: (state, action) => {
      return produce(state, draft => {
        const { payload: tempTodo } = action;
        draft.todos.push(tempTodo);
        draft.pending = true;
        draft.error = false;
      });
    },
    [INSERT_TODO_SUCCESS]: (state, action) => {
      const { payload: id } = action;
      return produce(state, draft => {
        draft.todos[draft.todos.length - 1].id = id;
        draft.pending = false;
      });
    },
    [INSERT_TODO_FAILURE]: (state, action) => {
      const { todos, err } = action.payload;
      console.error(err);
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
        draft.error = true;
      });
    },
    [REMOVE_TODO_PENDING]: (state, action) => {
      return produce(state, draft => {
        const { payload: idx } = action;
        draft.todos.splice(idx, 1);
        draft.pending = true;
        draft.error = false;
      });
    },
    [REMOVE_TODO_SUCCESS]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
      });
    },
    [REMOVE_TODO_FAILURE]: (state, action) => {
      const { todos, err } = action.payload;
      console.error(err);
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
        draft.error = true;
      });
    },
    [TOGGLE_TODO_PENDING]: (state, action) => {
      return produce(state, draft => {
        const { payload: idx } = action;
        draft.todos[idx].isDone = !draft.todos[idx].isDone;
        draft.pending = true;
        draft.error = false;
      });
    },
    [TOGGLE_TODO_SUCCESS]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
      });
    },
    [TOGGLE_TODO_FAILURE]: (state, action) => {
      const { idx, err } = action.payload;
      console.error(err);
      return produce(state, draft => {
        draft.todos[idx].isDone = !draft.todos[idx].isDone;
        draft.pending = false;
        draft.error = true;
      });
    },
    [TOGGLE_ALL_PENDING]: (state, action) => {
      return produce(state, draft => {
        const { payload: nextIsDone } = action;
        draft.todos.forEach(todo => todo.isDone = nextIsDone);
        draft.pending = true;
        draft.error = false;
      });
    },
    [TOGGLE_ALL_SUCCESS]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
      });
    },
    [TOGGLE_ALL_FAILURE]: (state, action) => {
      const { todos, err } = action.payload;
      console.error(err);
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
        draft.error = true;
      });
    },
  },
  initialState
);
