const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });

    goals.forEach(goal => {
      if (goal.deadline) {
        goal.deadlineLocal = new Date(goal.deadline.getTime() - goal.deadline.getTimezoneOffset() * 60000);
      }
    });

    res.render('goals', { goals });
  } catch (error) {
    console.error(error);
    res.render('goals', { error_msg: 'Error fetching goals' });
  }
};

exports.addGoal = async (req, res) => {
  const { title, description, deadline } = req.body;

  try {
    const newGoal = new Goal({
      title,
      description,
      deadline,
      user: req.user.id,
    });

    await newGoal.save();
    res.redirect('/goals');
  } catch (error) {
    console.error(error);
    res.render('goals', { error_msg: 'Error adding goal' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.redirect('/goals');
  } catch (error) {
    console.error(error);
    res.redirect('/goals');
  }
};

exports.editGoalForm = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    res.render('editGoal', { goal });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const parsedDeadline = new Date(deadline);
    await Goal.findByIdAndUpdate(req.params.id, { title, description, deadline: parsedDeadline });
    res.redirect('/goals');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
