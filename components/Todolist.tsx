import React, { useState } from 'react';
import { Todo } from '../services/api';

interface TodoListProps {
  todos: Todo[];
  openForm: (todo: Todo | null) => void;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, openForm, toggleComplete, deleteTodo }) => {
  const [deleteTodoId, setDeleteTodoId] = useState<string | null>(null);

  return (
    <>
      <ul className="space-y-2 w-full max-w-md mx-auto">
        {todos.length === 0 ? (
          <li className="text-center text-gray-500 text-xl">No todos yet</li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-600 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="mr-2"
                />
                <span
                  className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}
                  onClick={() => openForm(todo)}
                >
                  {todo.text}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openForm(todo)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTodoId(todo.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      {deleteTodoId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this todo?
            </h3>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTodoId(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTodo(deleteTodoId);
                  setDeleteTodoId(null);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoList;