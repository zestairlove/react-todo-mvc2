import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import App from '../components/App';
import * as inputActions from '../modules/input';
import * as todosActions from '../modules/todos';

export default connect(
  state => ({
    input: state.input,
    todos: state.todos.todos,
    editingId: state.todos.editingId,
    pending: state.todos.pending,
    error: state.todos.error
  }),
  dispatch => ({
    InputActions: bindActionCreators(inputActions, dispatch),
    TodosActions: bindActionCreators(todosActions, dispatch)
  })
)(App);