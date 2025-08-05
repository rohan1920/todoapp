import React, { useState, useEffect } from 'react';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

interface TodoFormProps {
  closeForm: () => void;
  addTodo: (title: string) => void;
  updateTodo: (id: string, title: string) => void;
  editingTodo: Todo | null;
}

const TodoForm: React.FC<TodoFormProps> = ({ closeForm, addTodo, updateTodo, editingTodo }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(editingTodo ? editingTodo.title : '');
  }, [editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a todo title');
      return;
    }
    if (editingTodo) {
      updateTodo(editingTodo._id, title);
    } else {
      addTodo(title);
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title"
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