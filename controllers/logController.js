const Log = require('../models/Log');

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ user: req.user._id });

    logs.forEach(log => {
      if (log.createdAt) {
        log.localCreatedAt = new Date(log.createdAt.getTime() - log.createdAt.getTimezoneOffset() * 60000);
      }
    });

    res.render('logs', { logs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.addLog = async (req, res) => {
  try {
    const {content, category, duration } = req.body;

    if (!content || !category ||!duration) {
      return res.status(400).send('All fields are required.');
    }

    const newLog = new Log({
      content,
      category,
      duration,
      user: req.user._id,
    });

    await newLog.save();
    res.redirect('/logs');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;

    await Log.findByIdAndDelete(id);

    res.redirect('/logs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.editLogForm = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    res.render('editLog', { log });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateLog = async (req, res) => {
  try {
    const { content, category, duration } = req.body;
    await Log.findByIdAndUpdate(req.params.id, { content, category, duration });
    res.redirect('/logs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getLogStats = async (req, res) => {
  try {
    const { period } = req.query;

    let startDate = new Date();
    let endDate = new Date();

    if (period === 'weekly') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (period === 'monthly') {
      startDate.setMonth(endDate.getMonth() - 1);
    } else {
      startDate.setDate(endDate.getDate() - 1);
    }

    const stats = await Log.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalMinutes: { $sum: "$duration" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          totalHours: { $divide: ["$totalMinutes", 60] },
          count: 1
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "err" });
  }
};
