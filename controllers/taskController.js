const Task = require('../models/task');

exports.list = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { user: req.user.id };

    if (status === 'pending' || status === 'completed') {
      filter.status = status;
    } else {
      filter.status = { $ne: 'deleted' };
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
};
