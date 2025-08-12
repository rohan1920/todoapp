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

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  is_admin?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Guest todo count interface
export interface GuestTodoCount {
  count: number;
  remaining: number;
  limit: number;
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
  private userId: string | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.userId) {
      headers['X-User-ID'] = this.userId;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getHeaders(),
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      // Handle backend response structure: {success: true, data: {...}}
      if (data.success && data.data) {
        return { data: data.data };
      }
      
      // Handle direct data response
      if (data.data) {
        return { data: data.data };
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

  // User authentication methods
  async registerUser(email: string, password: string, name: string): Promise<ApiResponse<User>> {
    return this.request<User>('/user/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async loginUser(email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Guest todo count
  async getGuestTodoCount(): Promise<ApiResponse<GuestTodoCount>> {
    return this.request<GuestTodoCount>('/todos/guest-count');
  }

  // Admin methods
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/user/admin/users', {
      headers: {
        ...this.getHeaders(),
        'User-ID': this.userId || '',
      },
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/user/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        ...this.getHeaders(),
        'User-ID': this.userId || '',
      },
    });
  }

  async checkAdminStatus(): Promise<ApiResponse<{ is_admin: boolean }>> {
    return this.request<{ is_admin: boolean }>('/user/admin/check', {
      headers: {
        ...this.getHeaders(),
        'User-ID': this.userId || '',
      },
    });
  }

  async createAdminUser(email: string, password: string, name: string): Promise<ApiResponse<User>> {
    return this.request<User>('/user/admin/create', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async toggleAdminStatus(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/user/admin/users/${userId}/toggle-admin`, {
      method: 'PATCH',
      headers: {
        ...this.getHeaders(),
        'User-ID': this.userId || '',
      },
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();