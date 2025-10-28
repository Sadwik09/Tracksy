const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Get token from localStorage
const getToken = () => {
  const user = localStorage.getItem("tracksyUser")
  if (user) {
    const userData = JSON.parse(user)
    return userData.token
  }
  return null
}

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Auth API
export const authAPI = {
  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () => apiRequest("/auth/me"),
}

// Transactions API
export const transactionsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/transactions${queryString ? `?${queryString}` : ""}`)
  },

  create: (transactionData) =>
    apiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    }),

  update: (id, transactionData) =>
    apiRequest(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    }),

  delete: (id) =>
    apiRequest(`/transactions/${id}`, {
      method: "DELETE",
    }),

  getStats: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/transactions/stats${queryString ? `?${queryString}` : ""}`)
  },
}

// Categories API
export const categoriesAPI = {
  getAll: (type) => apiRequest(`/categories${type ? `?type=${type}` : ""}`),

  create: (categoryData) =>
    apiRequest("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  update: (id, categoryData) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),

  delete: (id) =>
    apiRequest(`/categories/${id}`, {
      method: "DELETE",
    }),
}

// Budgets API
export const budgetsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/budgets${queryString ? `?${queryString}` : ""}`)
  },

  create: (budgetData) =>
    apiRequest("/budgets", {
      method: "POST",
      body: JSON.stringify(budgetData),
    }),

  update: (id, budgetData) =>
    apiRequest(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(budgetData),
    }),

  delete: (id) =>
    apiRequest(`/budgets/${id}`, {
      method: "DELETE",
    }),
}

// Users API
export const usersAPI = {
  updateProfile: (profileData) =>
    apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  updatePassword: (passwordData) =>
    apiRequest("/users/password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }),
}
