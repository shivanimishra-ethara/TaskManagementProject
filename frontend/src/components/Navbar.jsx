import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 flex items-center gap-2 tracking-tight">
            <div className="bg-gradient-to-tr from-primary-500 to-purple-500 p-1.5 rounded-lg text-white shadow-md">
              <FolderKanban className="w-6 h-6" />
            </div>
            TaskMaster
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-500 hover:text-primary-600 font-bold flex items-center gap-1.5 transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link to="/projects" className="text-gray-500 hover:text-primary-600 font-bold flex items-center gap-1.5 transition-colors">
              <FolderKanban className="w-4 h-4" /> Projects
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold shadow-md shadow-primary-500/20">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-gray-800 leading-none">{user?.name}</p>
              <p className="text-xs text-primary-600 font-medium">{user?.role}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-600 font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
