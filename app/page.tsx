'use client'

import React, { useState } from 'react';
import Header from '../components/Header';
import TodoList from '../components/Todolist';
import TodoForm from '../components/TodoFrom';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const saveTodo = (title: string, id?: string) => {
    if (id) {
      setTodos(todos.map((todo) => (todo._id === id ? { ...todo, title } : todo)));
    } else {
      setTodos([...todos, { _id: Math.random().toString(), title, completed: false }]);
    }
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map((todo) => (todo._id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const openForm = (todo: Todo | null = null) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingTodo(null);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto p-9">
        <div className="flex justify-center mb-7">
          <button
            onClick={() => openForm()}
            className="bg-blue-500 text-white p-4 w-180 text-xl font-bold text-center rounded hover:bg-blue-600"
          >
            Create Todo
          </button>
        </div>
        <TodoList
          todos={todos}
          openForm={openForm}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
        />
        {isFormOpen && (
          <TodoForm
            closeForm={closeForm}
            addTodo={saveTodo}
            updateTodo={saveTodo}
            editingTodo={editingTodo}
          />
        )}
      </main>
    </div>
  );
};

export default App;