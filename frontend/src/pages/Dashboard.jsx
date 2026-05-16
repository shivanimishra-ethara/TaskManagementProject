import { useState, useEffect } from 'react';
import api from '../api/api';
import { ClipboardList, CheckCircle, Clock, Users, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/dashboard');
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <div className="text-center py-10">Loading metrics...</div>;
  if (!metrics) return null;

  return (
    <div className="py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200/60 shadow-sm text-sm font-medium text-gray-600">
          Last updated: Just now
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Tasks" 
          value={metrics.totalTasks} 
          icon={<ClipboardList className="w-8 h-8 text-white" />}
          gradient="from-blue-500 to-indigo-600"
          shadowColor="shadow-blue-500/20"
        />
        <StatCard 
          title="Completed" 
          value={metrics.tasksByStatus['Done'] || 0} 
          icon={<CheckCircle className="w-8 h-8 text-white" />}
          gradient="from-emerald-400 to-teal-500"
          shadowColor="shadow-emerald-500/20"
        />
        <StatCard 
          title="In Progress" 
          value={metrics.tasksByStatus['In Progress'] || 0} 
          icon={<Clock className="w-8 h-8 text-white" />}
          gradient="from-amber-400 to-orange-500"
          shadowColor="shadow-orange-500/20"
        />
        <StatCard 
          title="Overdue" 
          value={metrics.overdueTasks} 
          icon={<AlertCircle className="w-8 h-8 text-white" />}
          gradient="from-rose-500 to-pink-600"
          shadowColor="shadow-rose-500/20"
        />
      </div>

      <div className="glass-card rounded-2xl p-8 animate-slide-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg"><Users className="w-6 h-6 text-indigo-600" /></div>
          Tasks Workload
        </h2>
        {metrics.tasksPerUser.length === 0 ? (
          <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No tasks assigned to any team members yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {metrics.tasksPerUser.map((userStat, index) => (
              <div key={userStat._id} className="flex items-center justify-between p-4 bg-white/60 hover:bg-white border border-gray-100 rounded-xl transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-sm">
                    {userStat.name.charAt(0)}
                  </div>
                  <span className="font-bold text-gray-800 text-lg">{userStat.name}</span>
                </div>
                <span className="bg-primary-50 text-primary-700 py-1.5 px-4 rounded-full text-sm font-bold border border-primary-100 shadow-sm">
                  {userStat.count} tasks
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient, shadowColor }) => (
  <div className={`glass-card p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${shadowColor}`}>
    <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">{title}</p>
      <p className="text-4xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
