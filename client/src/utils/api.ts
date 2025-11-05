const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  // Build a Headers instance so we can safely set values without TypeScript index errors
  const headers = new Headers(options.headers as HeadersInit);
  // Ensure Content-Type default when not provided
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.error || data.message || 'An error occurred');
    error.response = { data, status: response.status };
    throw error;
  }

  return data;
};

// Auth API
export const authAPI = {
  signup: async (userData: any) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  signin: async (credentials: { email: string; password: string }) => {
    const data = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  signout: () => {
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },
};

// Items API
export const itemsAPI = {
  getAll: async (filters?: {
    search?: string;
    department?: string;
    semester?: string;
    type?: string;
    category?: string;
    isAvailable?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return await apiRequest(`/items${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return await apiRequest(`/items/${id}`);
  },

  create: async (itemData: any) => {
    return await apiRequest('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  update: async (id: string, updates: any) => {
    return await apiRequest(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return await apiRequest(`/items/${id}`, {
      method: 'DELETE',
    });
  },

  getMyItems: async () => {
    return await apiRequest('/items/user/my-items');
  },
};

// Users API
export const usersAPI = {
  getById: async (id: string) => {
    return await apiRequest(`/users/${id}`);
  },

  updateProfile: async (updates: any) => {
    return await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  getUserItems: async (id: string) => {
    return await apiRequest(`/users/${id}/items`);
  },
};

// Messages API
export const messagesAPI = {
  getConversations: async () => {
    return await apiRequest('/messages/conversations');
  },

  getConversationMessages: async (conversationId: string) => {
    return await apiRequest(`/messages/conversation/${conversationId}`);
  },

  sendMessage: async (messageData: {
    receiverId: string;
    content: string;
    itemId?: string;
  }) => {
    return await apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getUnreadCount: async () => {
    return await apiRequest('/messages/unread/count');
  },

  markConversationAsRead: async (conversationId: string) => {
    return await apiRequest(`/messages/conversation/${conversationId}/read`, {
      method: 'PUT',
    });
  },
};

// Reviews API
export const reviewsAPI = {
  create: async (reviewData: {
    reviewedUserId: string;
    transactionId: string;
    rating: number;
    comment: string;
    categories?: {
      communication?: number;
      itemCondition?: number;
      punctuality?: number;
    };
  }) => {
    return await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  getUserReviews: async (userId: string) => {
    return await apiRequest(`/reviews/user/${userId}`);
  },

  getUserStats: async (userId: string) => {
    return await apiRequest(`/reviews/user/${userId}/stats`);
  },
};

// Transactions API
export const transactionsAPI = {
  create: async (transactionData: {
    itemId: string;
    sellerId: string;
    amount?: number;
  }) => {
    return await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  complete: async (id: string) => {
    return await apiRequest(`/transactions/${id}/complete`, {
      method: 'PUT',
    });
  },

  cancel: async (id: string) => {
    return await apiRequest(`/transactions/${id}/cancel`, {
      method: 'PUT',
    });
  },

  getMyTransactions: async (role?: 'buyer' | 'seller') => {
    const queryString = role ? `?role=${role}` : '';
    return await apiRequest(`/transactions/my-transactions${queryString}`);
  },

  getById: async (id: string) => {
    return await apiRequest(`/transactions/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    return await apiRequest('/admin/stats');
  },

  getAllUsers: async (search?: string, status?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const queryString = params.toString();
    return await apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getAllItems: async (search?: string, status?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const queryString = params.toString();
    return await apiRequest(`/admin/items${queryString ? `?${queryString}` : ''}`);
  },

  updateItemAvailability: async (id: string, isAvailable: boolean) => {
    return await apiRequest(`/admin/items/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ isAvailable }),
    });
  },

  deleteItem: async (id: string) => {
    return await apiRequest(`/admin/items/${id}`, {
      method: 'DELETE',
    });
  },

  getAllTransactions: async () => {
    return await apiRequest('/admin/transactions');
  },

  suspendUser: async (id: string, suspended: boolean) => {
    return await apiRequest(`/admin/users/${id}/suspend`, {
      method: 'PUT',
      body: JSON.stringify({ suspended }),
    });
  },

  deleteUser: async (id: string) => {
    return await apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  verifyUser: async (id: string, isVerified: boolean) => {
    return await apiRequest(`/admin/users/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ isVerified }),
    });
  },

  getAllReports: async (status?: string) => {
    const queryString = status ? `?status=${status}` : '';
    return await apiRequest(`/admin/reports${queryString}`);
  },

  resolveReport: async (id: string, action: 'approve' | 'reject') => {
    return await apiRequest(`/admin/reports/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  },

  getAnalytics: async () => {
    return await apiRequest('/admin/analytics');
  },
};
