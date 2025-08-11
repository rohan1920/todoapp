'use client'

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TodoList from '../components/Todolist';
import TodoForm from '../components/TodoFrom';
import Notification from '../components/Notification';
import AuthForm from '../components/AuthForm';
import GuestTodoLimit from '../components/GuestTodoLimit';
import { apiService, Todo, User, GuestTodoCount } from '../services/api';

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Guest todo limit state
  const [guestTodoCount, setGuestTodoCount] = useState<GuestTodoCount>({
    count: 0,
    remaining: 3,
    limit: 3
  });
  
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Load todos and check authentication on component mount
  useEffect(() => {
    loadTodos();
    loadGuestTodoCount();
    
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        apiService.setUserId(userData.id);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

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

  const loadGuestTodoCount = async () => {
    if (!user) {
      try {
        const response = await apiService.getGuestTodoCount();
        if (response.data) {
          setGuestTodoCount(response.data);
        }
      } catch (err) {
        console.error('Failed to load guest todo count:', err);
      }
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
          showNotification('Failed to update todo', 'error');
          return;
        }
        if (response.data) {
          setTodos(todos.map((todo) => (todo.id === id ? response.data! : todo)));
          showNotification('Todo updated successfully');
        }
      } else {
        // Create new todo
        const response = await apiService.createTodo(text);
        if (response.error) {
          setError(response.error);
          showNotification('Failed to create todo', 'error');
          return;
        }
        if (response.data) {
          setTodos([...todos, response.data]);
          showNotification('Todo created successfully');
          
          // Update guest todo count if user is not logged in
          if (!user) {
            await loadGuestTodoCount();
          }
        }
      }
    } catch (err) {
      setError('Failed to save todo');
      showNotification('Failed to save todo', 'error');
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      setError(null);
      const response = await apiService.toggleTodo(id);
      
      if (response.error) {
        setError(response.error);
        showNotification('Failed to toggle todo', 'error');
        return;
      }
      
      if (response.data) {
        setTodos(todos.map((todo) => (todo.id === id ? response.data! : todo)));
        const isCompleted = response.data.completed;
        showNotification(isCompleted ? 'Todo completed!' : 'Todo marked as incomplete');
      }
    } catch (err) {
      setError('Failed to toggle todo');
      showNotification('Failed to toggle todo', 'error');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      const response = await apiService.deleteTodo(id);
      
      if (response.error) {
        setError(response.error);
        showNotification('Failed to delete todo', 'error');
        return;
      }
      
      setTodos(todos.filter((todo) => todo.id !== id));
      showNotification('Todo deleted successfully');
      
      // Update guest todo count if user is not logged in
      if (!user) {
        await loadGuestTodoCount();
      }
    } catch (err) {
      setError('Failed to delete todo');
      showNotification('Failed to delete todo', 'error');
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

  // Authentication methods
  const handleRegister = () => {
    setAuthMode('register');
    setIsAuthFormOpen(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setIsAuthFormOpen(true);
  };

  const handleAuthModeChange = (mode: 'register' | 'login') => {
    setAuthMode(mode);
  };

  const handleAuthSubmit = async (email: string, password: string, name?: string) => {
    setAuthLoading(true);
    try {
      let response;
      
      if (authMode === 'register') {
        if (!name) {
          showNotification('Name is required for registration', 'error');
          return;
        }
        response = await apiService.registerUser(email, password, name);
      } else {
        response = await apiService.loginUser(email, password);
      }

      if (response.error) {
        showNotification(response.error, 'error');
      } else if (response.data) {
        const userData = response.data;
        setUser(userData);
        apiService.setUserId(userData.id);
        localStorage.setItem('user', JSON.stringify(userData));
        
        showNotification(
          authMode === 'register' 
            ? 'Registration successful! Welcome!' 
            : 'Login successful! Welcome back!'
        );
        
        setIsAuthFormOpen(false);
        
        // Reload todos for the authenticated user
        await loadTodos();
      }
    } catch (err) {
      showNotification('Authentication failed', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    apiService.setUserId(null);
    localStorage.removeItem('user');
    setTodos([]);
    showNotification('Logged out successfully');
    
    // Reload guest todo count
    loadGuestTodoCount();
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
      <Header 
        user={user} 
        onRegister={handleRegister} 
        onLogout={handleLogout} 
        onLogin={handleLogin}
      />
      <main className="container mx-auto p-9">
        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
            Error: {error}
          </div>
        )}
        
        {/* Show guest todo limit for non-authenticated users */}
        {!user && (
          <GuestTodoLimit
            count={guestTodoCount.count}
            remaining={guestTodoCount.remaining}
            limit={guestTodoCount.limit}
            onRegister={handleRegister}
            onLogin={handleLogin}
          />
        )}
        
        <div className="flex justify-center mb-7 space-x-4">
          {!user && guestTodoCount.remaining === 0 ? (
            <>
              <button
                onClick={handleLogin}
                className="p-4 w-180 text-xl font-bold text-center rounded transition-colors bg-green-500 text-white hover:bg-green-600"
              >
                Login to Create Todos
              </button>
              <button
                onClick={handleRegister}
                className="p-4 w-180 text-xl font-bold text-center rounded transition-colors bg-blue-500 text-white hover:bg-blue-600"
              >
                Register to Create Todos
              </button>
            </>
          ) : (
            <button
              onClick={() => openForm()}
              className="p-4 w-180 text-xl font-bold text-center rounded transition-colors bg-blue-500 text-white hover:bg-blue-600"
            >
              Create Todo
            </button>
          )}
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
        
        {isAuthFormOpen && (
          <AuthForm
            mode={authMode}
            onSubmit={handleAuthSubmit}
            onClose={() => setIsAuthFormOpen(false)}
            loading={authLoading}
            onModeChange={handleAuthModeChange}
          />
        )}
        
        <Notification
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
      </main>
    </div>
  );
};

export default  Home;