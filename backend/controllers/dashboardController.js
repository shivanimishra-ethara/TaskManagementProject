const Task = require('../models/Task');
const Project = require('../models/Project');
const mongoose = require('mongoose');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Private
const getDashboardMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    let projects = [];

    if (req.user.role === 'Admin') {
      // Admin sees all their created projects or where they are members
      projects = await Project.find({ $or: [{ creator: userId }, { members: userId }] }).select('_id');
    } else {
      // Member sees only projects they belong to
      projects = await Project.find({ members: userId }).select('_id');
    }

    const projectIds = projects.map(p => p._id);

    // Total tasks in accessible projects
    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Tasks per user (assigned to)
    const tasksPerUser = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $unwind: '$assignedTo' },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 1, name: '$user.name', count: 1 } }
    ]);

    // Overdue tasks
    const today = new Date();
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: today },
      status: { $ne: 'Done' }
    });

    // Formatting for frontend
    const formattedStatus = {
      'To Do': 0,
      'In Progress': 0,
      'Done': 0
    };
    tasksByStatus.forEach(item => {
      formattedStatus[item._id] = item.count;
    });

    res.json({
      totalTasks,
      tasksByStatus: formattedStatus,
      tasksPerUser,
      overdueTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardMetrics };
