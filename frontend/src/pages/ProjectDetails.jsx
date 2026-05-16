import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, UserPlus, Users, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Modals state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // New Task State
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do', assignedTo: [] });
  // New Member State
  const [memberEmail, setMemberEmail] = useState('');
  
  // All Users for assignment
  const [allUsers, setAllUsers] = useState([]);

  const fetchData = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
        api.get(`/projects/users`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...taskForm, project: id });
      toast.success('Task created!');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do', assignedTo: [] });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}/members`, { email: memberEmail });
      toast.success('Member added!');
      setShowMemberModal(false);
      setMemberEmail('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const isAdminOrCreator = user?.role === 'Admin' || project?.creator?._id === user?._id;

  if (loading) return <div className="text-center py-10">Loading project...</div>;
  if (!project) return null;

  const statuses = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="py-8 animate-fade-in">
      <div className="glass-card rounded-3xl p-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-white/60 shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{project.name}</h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">{project.description}</p>
          <div className="mt-5 flex gap-2 text-sm text-gray-600 font-medium items-center">
            <Users className="w-5 h-5 text-primary-500" />
            <span>Team Members ({project.members.length}):</span>
            <div className="flex -space-x-2 ml-2">
              {project.members.map((m, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm" title={m.name}>
                  {m.name ? m.name.charAt(0) : '?'}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
          {isAdminOrCreator && (
            <button
              onClick={() => setShowMemberModal(true)}
              className="bg-white/80 backdrop-blur-md border border-gray-200/60 text-gray-700 hover:bg-white hover:text-primary-600 px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-sm hover:shadow-md"
            >
              <UserPlus className="w-5 h-5" /> Invite
            </button>
          )}
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" /> Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {statuses.map(status => (
          <div key={status} className="bg-gray-100/50 backdrop-blur-sm rounded-3xl p-5 min-h-[500px] border border-gray-200/50 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="font-extrabold text-gray-800 flex items-center gap-2.5 text-lg tracking-tight">
                {status === 'To Do' && <div className="p-1.5 bg-gray-200 text-gray-600 rounded-lg"><AlertCircle className="w-5 h-5" /></div>}
                {status === 'In Progress' && <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Clock className="w-5 h-5" /></div>}
                {status === 'Done' && <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>}
                {status}
              </h3>
              <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-gray-100">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="space-y-4 flex-grow">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/80 hover:border-primary-300 transition-all hover:shadow-lg group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-primary-600 transition-colors">{task.title}</h4>
                  </div>
                  {task.description && <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{task.description}</p>}
                  
                  <div className="flex items-center gap-3 text-xs font-semibold mb-5">
                    {task.dueDate && (
                      <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> 
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-md border ${
                      task.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                    <div className="flex -space-x-2">
                      {task.assignedTo.length === 0 ? (
                        <span className="text-xs text-gray-400 font-medium">Unassigned</span>
                      ) : (
                        task.assignedTo.map(user => (
                          <div key={user._id} className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm" title={user.name}>
                            {user.name.charAt(0)}
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="relative">
                      <select 
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="appearance-none text-xs font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 cursor-pointer transition-all hover:bg-gray-100"
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-400">No tasks here</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up border border-white/50">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-200/50 hover:bg-gray-200 rounded-full p-1.5">×</button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Task Title</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-800 font-medium"
                    placeholder="What needs to be done?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-800 font-medium"
                    rows="3"
                    placeholder="Add more details..."
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Due Date</label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Priority</label>
                    <div className="relative">
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                        className="w-full appearance-none px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-800 font-medium"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Assign To</label>
                  <select
                    multiple
                    value={taskForm.assignedTo}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setTaskForm({...taskForm, assignedTo: selected});
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-800 font-medium h-28"
                  >
                    {project.members.map(user => (
                      <option key={user._id} value={user._id} className="p-1.5 rounded-md hover:bg-primary-50">
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2 ml-1 font-medium">Hold <kbd className="bg-gray-100 border border-gray-200 rounded px-1">Cmd/Ctrl</kbd> to select multiple team members</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl transition-all shadow-md shadow-primary-500/30 hover:shadow-primary-500/50"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-white/50">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-800">Invite Team Member</h2>
              <button onClick={() => setShowMemberModal(false)} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-200/50 hover:bg-gray-200 rounded-full p-1.5">×</button>
            </div>
            <form onSubmit={handleAddMember} className="p-6">
              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Team Member Email</label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-800 font-medium"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 font-medium ml-1 mb-8">They must already have an account on TaskMaster.</p>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl transition-all shadow-md shadow-primary-500/30 hover:shadow-primary-500/50"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
