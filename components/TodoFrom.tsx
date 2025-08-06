import React, { useState, useEffect } from 'react';
import { Todo } from '../services/api';

interface TodoFormProps {
  closeForm: () => void;
  addTodo: (text: string) => void;
  updateTodo: (id: string, text: string) => void;
  editingTodo: Todo | null;
}

const TodoForm: React.FC<TodoFormProps> = ({ closeForm, addTodo, updateTodo, editingTodo }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(editingTodo ? editingTodo.text : '');
  }, [editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Please enter a todo text');
      return;
    }
    if (editingTodo) {
      updateTodo(editingTodo.id, text);
    } else {
      addTodo(text);
    }
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex justify-end">
      <div className="bg-gray-200 w-full max-w-md p-6 h-full transform transition-transform translate-x-0 animate-slide-in">
        <h2 className="text-xl font-bold mb-4">{editingTodo ? 'Edit Todo' : 'Add Todo'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter todo text"
            className="w-full p-2 border rounded mb-4"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingTodo ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;