/**
 * API Service Layer
 * Handles all HTTP requests to the Python Flask backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Todo interface matching the backend structure
export interface Todo {
  id: string;
  text: string;
  color?: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

// API Response types
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface DeleteResponse {
  message: string;
  deletedTodo?: Todo;
  deletedCount?: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  }

  // Get all todos
  async getTodos(): Promise<ApiResponse<Todo[]>> {
    return this.request<Todo[]>('/todos');
  }

  // Get a single todo
  async getTodo(id: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`);
  }

  // Create a new todo
  async createTodo(text: string, color?: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify({ text, color }),
    });
  }

  // Update a todo
  async updateTodo(
    id: string,
    updates: Partial<Pick<Todo, 'text' | 'completed' | 'color'>>
  ): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Toggle todo completion
  async toggleTodo(id: string): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<ApiResponse<DeleteResponse>> {
    return this.request<DeleteResponse>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // Delete all todos
  async deleteAllTodos(): Promise<ApiResponse<DeleteResponse>> {
    return this.request<DeleteResponse>('/todos', {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService(); 