import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] animate-fade-in relative z-10">
      {/* Decorative gradient blur blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="glass p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white/60 animate-slide-up relative z-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 font-medium">Sign in to manage your team tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm backdrop-blur-sm"
              placeholder="you@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm backdrop-blur-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:text-primary-700 hover:underline font-bold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
