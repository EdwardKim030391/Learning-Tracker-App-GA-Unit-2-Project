const Goal = require('../models/Goal');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
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
