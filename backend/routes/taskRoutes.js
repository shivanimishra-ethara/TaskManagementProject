const express = require('express');
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createTask);

router.route('/project/:projectId')
  .get(protect, getTasksByProject);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, admin, deleteTask);

module.exports = router;
