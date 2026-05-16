const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, project, assignedTo } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo: assignedTo || [],
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status (or other fields)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Admins can update anything. Members can only update status if they are assigned.
    if (req.user.role !== 'Admin' && !task.assignedTo.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    if (assignedTo && req.user.role === 'Admin') {
      task.assignedTo = assignedTo;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasksByProject, updateTask, deleteTask };
