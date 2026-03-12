import { useState } from 'react';

// --- Accessibility (Role="dialog") And Error Handling ---
const AuthModal = ({ isOpen, onClose, useAuthHook }) => {
  const { login, register, loading, error, setError } = useAuthHook;
  const [isLoginView, setIsLoginView] = useState(true);
  
  // --- Form State ---
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // --- Clear errors when user types ---
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    
    if (isLoginView) {
      result = await login(formData.username, formData.password);
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!"); // --- Check If Passwords Match Before Sending To API ---
        return;
      }
      result = await register(formData.username, formData.email, formData.password);
    }

    if (result.success) {
      onClose(); // --- Close Modal Instantly On Success ---
      setFormData({ username: '', email: '', password: '', confirmPassword: ''}); // --- Reset Form ---
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-2000 flex items-center justify-center p-4 transition-opacity"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="auth-title"
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
        >
          ✕
        </button>

        <h2 id="auth-title" className="text-2xl font-black mb-6 text-gray-900 text-center">
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </h2>

        {/* --- Dynamic Error Feedback Loop --- */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username (Alphanumeric only)" 
            required
            aria-label="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
          
          {!isLoginView && (
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address" 
              required
              aria-label="Email address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
          )}

          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={isLoginView ? "Password" : "Password (Min 6, 1 Uppercase, 1 Special)"} 
            required
            aria-label="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />

          {!isLoginView && (
            <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            aria-label="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
          />
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 active:scale-[0.98] transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              isLoginView ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError(null); // --- Clear errors when switching views ---
            }}
            className="font-bold text-orange-600 hover:underline focus:outline-none"
          >
            {isLoginView ? 'Create one' : 'Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;