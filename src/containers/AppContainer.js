import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import App from '../components/App';
import * as inputActions from '../modules/input';
import * as todosActions from '../modules/todos';

export default connect(
  state => ({
    input: state.inputData,
    todos: state.todoData.todos,
    editingId: state.todoData.editingId,
    pending: state.todoData.pending,
    error: state.todoData.error
  }),
  dispatch => ({
    InputActions: bindActionCreators(inputActions, dispatch),
    TodosActions: bindActionCreators(todosActions, dispatch)
  })
)(App);