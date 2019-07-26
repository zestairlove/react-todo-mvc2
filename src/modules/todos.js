import produce from 'immer';
import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

import * as api from '../lib/api';

// action types
const FETCH_TODOS = 'todos/FETCH_TODOS';
const INSERT_TODO = 'todos/INSERT_TODO';
const TOGGLE_TODO = 'todos/TOGGLE_TODO';
const TOGGLE_ALL = 'todos/TOGGLE_ALL';
const REMOVE_TODO = 'todos/REMOVE_TODO';
const EDIT_START = 'todos/EDIT_START';
const EDIT_SAVE = 'todos/EDIT_SAVE';
const EDIT_CANCEL = 'todos/EDIT_CANCEL';
const CLEAR_COMPLETED = 'todos/CLEAR_COMPLETED';

// action creator
export const initTodos = () => dispatch => {
  console.log('fetching todos started');
  return dispatch({
    type: FETCH_TODOS,
    payload: {
      promise: new Promise((resolve, reject) => {
        api.fetchTodos()
          .then(({ data }) => {
            const initialTodos = Object.keys(data).reduce((acc, key) => {
              acc.push({ id: key, text: data[key].text, isDone: data[key].isDone });
              return acc;
            }, []);
            resolve(initialTodos);
            console.log('fetching todos completed');
          })
          .catch(err => {
            reject(err);
            console.log('fetching todos failed');
          })
        })
    }
  }).catch(err => console.error(err));
};

export const insertTodo = () => (dispatch, getState) => {
  const { inputData: input } = getState();
  const tempId = 'temp_' + Date.now();
  const tempTodo = { id: tempId, text: input, isDone: false };

  console.log('Insert todo started');
  return dispatch({
    type: INSERT_TODO,
    payload: {
      data: tempTodo,
      promise: new Promise((resolve, reject) => {
        api.insertTodo(input)
          .then(({ data }) => {
            resolve(data.name);
            console.log('Insert todo completed');
          })
          .catch(err => {
            reject(err);
            console.log('Insert todo failed');
          })
      })
    }
  }).catch(err => console.error(err));
}

export const toggleTodo = id => (dispatch, getState) => {
  const { todoData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);
  const nextIsDone = !todos[idx].isDone;

  return dispatch({
    type: TOGGLE_TODO,
    payload: {
      data: idx,
      promise: new Promise((resolve, reject) => {
        api.patchTodo(id, { isDone: nextIsDone })
          .then(res => {
            resolve(res);
            console.log('toggle todo completed');
          })
          .catch(err => {
            reject({ idx, err });
            console.log('toggle todo failed');
          });
      })
    }
  }).catch(err => console.error(err));
};

export const toggleAll = () => (dispatch, getState) => {
  const { todoData: { todos } } = getState();
  const nextIsDone = todos.some(todo => !todo.isDone);
  const axiArray = todos.map(todo =>
    api.patchTodo(todo.id, { isDone: nextIsDone })
  );
  
  console.log('Toggle All started');
  return dispatch({
    type: TOGGLE_ALL,
    payload: {
      data: nextIsDone,
      promise: new Promise((resolve, reject) => {
        axios.all(axiArray)
          .then(res => {
            resolve(res);
            console.log('Toggle All completed');
          })
          .catch(err => {
            reject({ todos, err });
            console.log('Toggle All failed');
          })
      })
    }
  }).catch(err => console.error(err));
};

export const removeTodo = id => (dispatch, getState) => {
  const { todoData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);

  return dispatch({
    type: REMOVE_TODO,
    payload: {
      data: idx,
      promise: new Promise((resolve, reject) => {
        api.removeTodo(id)
          .then(res => {
            resolve(id);
            console.log('Remove todo completed');
          })
          .catch(err => {
            reject({ todos, err });
            console.log('Remove todo failed');
          });
      })
    }
  }).catch(err => console.error(err));
};

export const editStart = createAction(EDIT_START, id => id);
export const editCancel = createAction(EDIT_CANCEL);

export const editSave = (id, text) => (dispatch, getState) => {
  const { todoData: { todos } } = getState();
  const idx = todos.findIndex(todo => todo.id === id);

  console.log('Edit save started');
  return dispatch({
    type: EDIT_SAVE,
    payload: {
      data: { idx, text },
      promise: new Promise((resolve, reject) => {
        api.patchTodo(id, { text })
          .then(res => {
            resolve(res);
            console.log('Edit save completed');
          })
          .catch(err => {
            reject({ todos, err });
            console.log('Edit save failed');
          });
      })
    }
  }).catch(err => console.error(err));
};

export const clearCompleted = () => (dispatch, getState) => {
  const { todoData: { todos } } = getState();
  const nextTodos = todos.filter(todo => !todo.isDone);
  const axiArray = todos
    .filter(todo => todo.isDone)
    .map(todo => api.removeTodo(todo.id));
    
  console.log('ClearCompleted started');
  return dispatch({
    type: CLEAR_COMPLETED,
    payload: {
      data: nextTodos,
      promise: new Promise((resolve, reject) => {
        axios.all(axiArray)
          .then(res => {
            resolve(res);
            console.log('ClearCompleted completed');
          })
          .catch(err => {
            reject({ todos, err });
            console.log('ClearCompleted failed');
          });
      })
    }
  }).catch(err => console.error(err));
};

const initialState = {
  todos: [],
  editingId: null,
  pending: false,
  error: false
};

export default handleActions(
  {
    [`${FETCH_TODOS}_PENDING`]: (state, action) => {
      return produce(state, draft => {
        draft.pending = true;
        draft.error = false;
      });
    },
    [`${FETCH_TODOS}_SUCCESS`]: (state, action) => {
      const { payload: todos } = action;
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
      });
    },
    [`${FETCH_TODOS}_FAILURE`]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
        draft.error = true;
      });
    },
    [`${INSERT_TODO}_PENDING`]: (state, action) => {
      const { payload: tempTodo } = action;
      return produce(state, draft => {
        draft.todos.push(tempTodo);
        draft.pending = true;
        draft.error = false;
      });
    },
    [`${INSERT_TODO}_SUCCESS`]: (state, action) => {
      const { payload: id } = action;
      return produce(state, draft => {
        draft.todos[draft.todos.length - 1].id = id;
        draft.pending = false;
      });
    },
    [`${INSERT_TODO}_FAILURE`]: (state, action) => {
      return produce(state, draft => {
        draft.todos.length = draft.todos.length - 1;
        draft.pending = false;
        draft.error = true;
      });
    },
    [`${TOGGLE_TODO}_PENDING`]: (state, action) => {
      const { payload: idx } = action;
      return produce(state, draft => {
        draft.todos[idx].isDone = !draft.todos[idx].isDone;
        draft.pending = true;
        draft.error = false;
      });
    },
    [`${TOGGLE_TODO}_SUCCESS`]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
      });
    },
    [`${TOGGLE_TODO}_FAILURE`]: (state, action) => {
      const { idx } = action.payload;
      return produce(state, draft => {
        draft.todos[idx].isDone = !draft.todos[idx].isDone;
        draft.pending = false;
        draft.error = true;
      });
    },
    [`${TOGGLE_ALL}_PENDING`]: (state, action) => {
      const { payload: nextIsDone } = action;
      return produce(state, draft => {
        draft.todos.forEach(todo => todo.isDone = nextIsDone);
        draft.pending = true;
        draft.error = false;
      });
    },
    [`${TOGGLE_ALL}_SUCCESS`]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
      });
    },
    [`${TOGGLE_ALL}_FAILURE`]: (state, action) => {
      const { todos } = action.payload;
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
        draft.error = true;
      });
    },
    [`${REMOVE_TODO}_PENDING`]: (state, action) => {
      const { payload: idx } = action;
      return produce(state, draft => {
        draft.todos.splice(idx, 1);
        draft.pending = true;
        draft.error = false;
      });
    },
    [`${REMOVE_TODO}_SUCCESS`]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
      });
    },
    [`${REMOVE_TODO}_FAILURE`]: (state, action) => {
      const { todos } = action.payload;
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
        draft.error = true;
      });
    },
    [EDIT_START]: (state, action) => {
      const { payload: id } = action;
      return produce(state, draft => {
        draft.editingId = id;
      });
    },
    [EDIT_CANCEL]: (state, action) => {
      return produce(state, draft => {
        draft.editingId = null;
      });
    },
    [`${EDIT_SAVE}_PENDING`]: (state, action) => {
      const { idx, text } = action.payload;
      return produce(state, draft => {
        draft.todos[idx].text = text;
        draft.editingId = null;
        draft.pending = true;
        draft.error = false;
      });
    },
    [`${EDIT_SAVE}_SUCCESS`]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
      });
    },
    [`${EDIT_SAVE}_FAILURE`]: (state, action) => {
      const { todos } = action.payload;
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
        draft.error = true;
      });
    },
    [`${CLEAR_COMPLETED}_PENDING`]: (state, action) => {
      const { payload: nextTodos } = action;
      return produce(state, draft => {
        draft.todos = nextTodos;
        draft.pending = true;
        draft.error = false;
      });
    },
    [`${CLEAR_COMPLETED}_SUCCESS`]: (state, action) => {
      return produce(state, draft => {
        draft.pending = false;
      });
    },
    [`${CLEAR_COMPLETED}_FAILURE`]: (state, action) => {
      const { todos } = action.payload;
      return produce(state, draft => {
        draft.todos = todos;
        draft.pending = false;
        draft.error = true;
      });
    }
  },
  initialState
);
