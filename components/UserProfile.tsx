import React, { useState } from 'react';
import { User } from '../services/api';

interface UserProfileProps {
  user: User | null;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Safety check - if user is null/undefined, don't render
  if (!user) {
    return null;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  // Safe fallbacks for user data
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">
            {userInitial}
          </span>
        </div>
        <span className="hidden sm:block">{userName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {userInitial}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{userName}</h3>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 text-sm text-gray-600">
            <p>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
          </div>

          <div className="border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
