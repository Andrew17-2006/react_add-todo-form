import './App.scss';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { useState } from 'react';
import { TodoList } from './components/TodoList';
import { Todo } from './api/types';

const initialTodos: Todo[] = todosFromServer.map(todo => {
  const user = usersFromServer.find(u => u.id === todo.userId)!;

  return {
    ...todo,
    user,
  };
});

export const App = () => {
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const [titleError, setTitleError] = useState('');
  const [userIdError, setUserIdError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let hasError = false;

    if (!title) {
      setTitleError('Title is required');
      hasError = true;
    }

    if (!userId) {
      setUserIdError('User is required');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const user = usersFromServer.find(u => u.id === userId)!;

    const newTodo: Todo = {
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      title,
      completed: false,
      userId,
      user,
    };

    setTodos(prev => [...prev, newTodo]);

    // очистка форми
    setTitle('');
    setUserId(0);
    setTitleError('');
    setUserIdError('');
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
              setTitleError('');
            }}
          />
          {titleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <select
            value={userId}
            onChange={event => {
              setUserId(+event.target.value);
              setUserIdError('');
            }}
          >
            <option value="0" disabled>
              Choose a user
            </option>

            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {userIdError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};
