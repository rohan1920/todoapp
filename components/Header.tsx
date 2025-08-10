import React from 'react';
import { User } from '../services/api';
import UserProfile from './UserProfile';

interface HeaderProps {
  user: User | null;
  onRegister: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onRegister, onLogout }) => {
  return (
    <header className='bg-black text-white p-12 shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-4xl font-extrabold'>🚀 TODO LIST</h1>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <UserProfile user={user} onLogout={onLogout} />
          ) : (
            <button
              onClick={onRegister}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;