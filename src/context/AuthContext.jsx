import { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await auth.login({ username: email, password });
      const { access_token, refresh_token, user } = response.data;
      
      setUser(user);
      setToken(access_token);
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success(`Welcome back, ${user.full_name}! 🎉`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const response = await auth.register({ 
        full_name: fullName, 
        email, 
        password 
      });
      const user = response.data;
      
      // Auto-login after registration
      const loginResponse = await auth.login({ username: email, password });
      const { access_token, refresh_token } = loginResponse.data;
      
      setUser(user);
      setToken(access_token);
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success(`Account created! Welcome ${user.full_name}! 🎉`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
