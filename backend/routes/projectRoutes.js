const express = require('express');
const { createProject, getProjects, getProjectById, addMember, getAllUsers } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.get('/users', protect, getAllUsers); // Route to fetch all users for invites

router.route('/:id')
  .get(protect, getProjectById);

router.route('/:id/members')
  .put(protect, admin, addMember);

module.exports = router;
