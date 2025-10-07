const express = require('express');
const Task = require('../models/task');
const requireAuth = require('../middleware/auth');
const router = express.Router();

// Home - View tasks
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { user: req.user.id };

    if (status === 'pending' || status === 'completed') {
      filter.status = status;
    } else {
      filter.status = { $ne: 'deleted' }; // Hide deleted by default
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    const pendingCount = await Task.countDocuments({ user: req.user.id, status: 'pending' });
    const completedCount = await Task.countDocuments({ user: req.user.id, status: 'completed' });

    res.render('index', {
      title: 'My Tasks',
      tasks,
      pendingCount,
      completedCount,
      currentStatus: status || 'all'
    });
  } catch (err) {
    console.error('Error loading tasks:', err.message);
    req.flash('error_msg', 'Error loading tasks');
    res.redirect('/auth/login');
  }
});

// Create task
router.post('/', requireAuth, async (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) {
    req.flash('error_msg', 'Task title is required');
    return res.redirect('/');
  }

  try {
    const task = new Task({ title: title.trim(), user: req.user.id });
    await task.save();
    req.flash('success_msg', 'Task added!');
    res.redirect('/');
  } catch (err) {
    console.error('Error creating task:', err.message);
    req.flash('error_msg', 'Error adding task');
    res.redirect('/');
  }
});

// Update task status
router.post('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'completed', 'deleted'];

  if (!validStatuses.includes(status)) {
    req.flash('error_msg', 'Invalid status');
    return res.redirect('/');
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      req.flash('error_msg', 'Task not found');
      return res.redirect('/');
    }

    task.status = status;
    await task.save();
    req.flash('success_msg', 'Task updated!');
    res.redirect('/');
  } catch (err) {
    console.error('Error updating task:', err.message);
    req.flash('error_msg', 'Error updating task');
    res.redirect('/');
  }
});

module.exports = router;
