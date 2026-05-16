import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] animate-fade-in relative z-10">
      {/* Decorative gradient blur blobs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="glass p-10 rounded-2xl shadow-2xl max-w-md w-full border border-white/60 animate-slide-up relative z-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-600 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-2 font-medium">Join to collaborate with your team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm backdrop-blur-sm"
              placeholder="John Doe"
              required
            />
          </div>
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full appearance-none px-5 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-gray-800 shadow-sm backdrop-blur-sm cursor-pointer"
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign Up
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 hover:underline font-bold transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
