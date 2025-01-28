const Log = require('../models/Log');

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user.id }).sort({ date: -1 });
    res.render('logs', { logs });
  } catch (error) {
    console.error(error);
    res.render('logs', { error_msg: 'Error fetching logs' });
  }
};

exports.addLog = async (req, res) => {
  const { content } = req.body;

  try {
    const newLog = new Log({
      content,
      user: req.user.id,
    });

    await newLog.save();
    res.redirect('/logs');
  } catch (error) {
    console.error(error);
    res.render('logs', { error_msg: 'Error adding log' });
  }
};
