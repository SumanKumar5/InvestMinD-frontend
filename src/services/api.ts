import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('investmind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', { email, password });
  const { token, name, email: userEmail } = response.data;

  return {
    token,
    user: {
      name,
      firstName: name.split(' ')[0], 
      email: userEmail,
    },
  };
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await api.post('/api/auth/signup', { name, email, password });
  return response.data;
};

export const verifyEmail = async (email: string, otp: string) => {
  const response = await api.post('/api/auth/verify-email', { email, otp });
  return response.data;
};

export const resendOtp = async (email: string) => {
  const response = await api.post('/api/auth/resend-otp', { email });
  return response.data;
};

// Request password reset OTP
export const requestPasswordReset = async (email: string) => {
  const response = await api.post('/api/auth/request-reset', { email });
  return response.data;
};

// Reset password using OTP
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const response = await api.post('/api/auth/reset-password', {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

// Google Sign-in
export const loginWithGoogle = async (idToken: string) => {
  const res = await api.post("/api/auth/google", { idToken });
  return res.data;
};

// Portfolio endpoints
export const getPortfolios = async () => {
  const response = await api.get('/api/portfolios');
  return response.data;
};

export const createPortfolio = async (name: string) => {
  const response = await api.post('/api/portfolios', { name });
  return response.data;
};

export const deletePortfolio = async (id: string) => {
  const response = await api.delete(`/api/portfolios/${id}`);
  return response.data;
};

// Portfolio details endpoints
export const getPortfolioSummary = async (portfolioId: string) => {
  const response = await api.get(`/api/portfolios/${portfolioId}/summary`);
  return response.data;
};

export const getPortfolioAnalytics = async (portfolioId: string) => {
  const response = await api.get(`/api/portfolios/${portfolioId}/analytics`);
  return response.data;
};

export const getPortfolioPerformance = async (
  portfolioId: string,
  range: string
): Promise<Performance[]> => {
  const response = await api.get(`/api/portfolios/${portfolioId}/performance?range=${range}`);
  return response.data.data; 
};

export const getPortfolioStocks = async (portfolioId: string) => {
  const response = await api.get(`/api/portfolios/${portfolioId}/stocks`);
  return response.data;
};

export const getBestWorstPerformers = async (portfolioId: string) => {
  const response = await api.get(`/api/portfolios/${portfolioId}/best-worst`);
  return response.data;
};

// Holdings endpoints
export const addHolding = async (
  portfolioId: string,
  holding: {
    symbol: string;
    quantity: string;
    buyPrice: string;
    notes?: string;
    companyName: string;
    type: 'buy' | 'sell';
  }
) => {
  const payload = {
    symbol: holding.symbol,
    quantity: Number(holding.quantity),
    avgBuyPrice: Number(holding.buyPrice),
    notes: holding.notes || "",
    type: holding.type,
    currency: "USD",
    companyName: holding.companyName.trim()
  };

  const response = await api.post(`/api/portfolios/${portfolioId}/holdings`, payload);
  return response.data;
};

export const deleteHolding = async (holdingId: string) => {
  const response = await api.delete(`/api/holdings/${holdingId}`);
  return response.data;
};

// Transactions endpoints
export const getTransactions = async (holdingId: string) => {
  const response = await api.get(`/api/transactions/holdings/${holdingId}`);
  return response.data;
};

// Export endpoint
export const exportPortfolio = async (portfolioId: string) => {
  const response = await api.get(`/api/exports/portfolios/${portfolioId}`, {
    responseType: 'blob'
  });
  return response.data;
};

// AI Insight endpoints
export const getPortfolioInsight = async (
  portfolioId: string
): Promise<{ insight: string }> => {
  const response = await api.get(`/api/insight/${portfolioId}`);
  return response.data;
};

export const getStockInsight = async (
  portfolioId: string,
  symbol: string
): Promise<{ insight: string }> => {
  const response = await api.get(`/api/ai/insight/${portfolioId}/${symbol}`);
  return response.data;
};


// Get holding details (for /holding/:holdingId page)
export const getHoldingDetails = async (holdingId: string) => {
  const response = await api.get(`/api/holdings/${holdingId}`);
  return response.data;
};

export default api;