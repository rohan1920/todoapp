import React from 'react';

interface GuestTodoLimitProps {
  count: number;
  remaining: number;
  limit: number;
  onRegister: () => void;
}

const GuestTodoLimit: React.FC<GuestTodoLimitProps> = ({ count, remaining, limit, onRegister }) => {
  const isAtLimit = remaining === 0;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800">
              {isAtLimit ? 'Todo Limit Reached!' : 'Guest Mode'}
            </h3>
            <p className="text-sm text-yellow-700">
              {isAtLimit 
                ? 'You have reached the limit of 3 todos for guest users.'
                : `You have ${remaining} todo${remaining !== 1 ? 's' : ''} remaining.`
              }
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-yellow-700 mb-2">
            {count}/{limit} todos used
          </div>
          <button
            onClick={onRegister}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
          >
            {isAtLimit ? 'Register Now' : 'Register for Unlimited'}
          </button>
        </div>
      </div>
      
      {!isAtLimit && (
        <div className="mt-3 pt-3 border-t border-yellow-200">
          <p className="text-xs text-yellow-600">
            💡 Register for free to create unlimited todos and access your data from anywhere!
          </p>
        </div>
      )}
    </div>
  );
};

export default GuestTodoLimit;
