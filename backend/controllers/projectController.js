const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a project (Creator becomes Admin)
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // User becomes Admin if they create a project
    if (req.user.role !== 'Admin') {
      req.user.role = 'Admin';
      await req.user.save();
    }

    const project = await Project.create({
      name,
      description,
      creator: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects (for admin) or assigned projects (for member)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate('creator', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.some(member => member._id.toString() === req.user._id.toString()) && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private/Admin
const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only creator or admin can add members
    if (project.creator.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.members.push(user._id);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users for assigning tasks/members
// @route   GET /api/projects/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, addMember, getAllUsers };
