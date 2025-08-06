'use client'

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TodoList from '../components/Todolist';
import TodoForm from '../components/TodoFrom';
import { apiService, Todo } from '../services/api';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTodos();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setTodos(response.data);
      }
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const saveTodo = async (text: string, id?: string) => {
    try {
      setError(null);
      
      if (id) {
        // Update existing todo
        const response = await apiService.updateTodo(id, { text });
        if (response.error) {
          setError(response.error);
          return;
        }
        if (response.data) {
          setTodos(todos.map((todo) => (todo.id === id ? response.data! : todo)));
        }
      } else {
        // Create new todo
        const response = await apiService.createTodo(text);
        if (response.error) {
          setError(response.error);
          return;
        }
        if (response.data) {
          setTodos([...todos, response.data]);
        }
      }
    } catch (err) {
      setError('Failed to save todo');
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      setError(null);
      const response = await apiService.toggleTodo(id);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      if (response.data) {
        setTodos(todos.map((todo) => (todo.id === id ? response.data! : todo)));
      }
    } catch (err) {
      setError('Failed to toggle todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      const response = await apiService.deleteTodo(id);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const openForm = (todo: Todo | null = null) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingTodo(null);
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto p-9">
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
            Error: {error}
          </div>
        )}
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
            addTodo={(text) => saveTodo(text)}
            updateTodo={(id, text) => saveTodo(text, id)}
            editingTodo={editingTodo}
          />
        )}
      </main>
    </div>
  );
};

export default App;