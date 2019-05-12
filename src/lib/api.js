import axios from 'axios';

const axi = axios.create({
  baseURL: 'https://react-todo-mvc-f0004.firebaseio.com/todos',
  timeout: 1000
});

export const fetchTodos = () => axi.get('/.json');

export const insertTodo = text => axi.post('/.json', { text, isDone: false });

export const removeTodo = id => axi.delete(`/${id}/.json`);
