import { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Plus, Folder } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName, description: newProjectDesc });
      toast.success('Project created successfully!');
      setShowModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} className="block group">
            <div className="glass-card p-6 rounded-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400 to-purple-400 opacity-10 rounded-bl-[100px] transition-opacity group-hover:opacity-20"></div>
              
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-md">
                  <Folder className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                  {project.name}
                </h3>
              </div>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow relative z-10 leading-relaxed">
                {project.description || 'No description provided.'}
              </p>
              <div className="flex justify-between items-center text-sm border-t border-gray-100/50 pt-5 mt-auto relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((m, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                        {m.name ? m.name.charAt(0) : '?'}
                      </div>
                    ))}
                    {project.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-500 font-medium">{project.members.length} members</span>
                </div>
                <span className="text-primary-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open <span className="text-lg">→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-16 glass-card rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No projects yet</h3>
            <p className="text-gray-500 font-medium">Create your first project to start organizing tasks.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-white/50">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-1">×</button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-800 font-medium"
                    placeholder="e.g. Website Redesign"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Description</label>
                  <textarea
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-800 font-medium"
                    rows="3"
                    placeholder="Briefly describe the project goals..."
                  ></textarea>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl transition-all shadow-md shadow-primary-500/30 hover:shadow-primary-500/50"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
