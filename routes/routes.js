const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const goalController = require('../controllers/goalController');
const logController = require('../controllers/logController');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

router.get('/', (req, res) => res.render('index'));

router.get('/register', (req, res) => res.render('register'));
router.post('/register', userController.registerUser);

router.get('/login', (req, res) => res.render('login'));
router.post('/login', userController.loginUser);

router.get('/logout', userController.logoutUser);

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', { user: req.user })
);

router.get('/goals', ensureAuthenticated, goalController.getGoals);
router.post('/goals/add', ensureAuthenticated, goalController.addGoal);
router.post('/goals/delete/:id', ensureAuthenticated, goalController.deleteGoal);
router.get('/goals/edit/:id', ensureAuthenticated, goalController.editGoalForm);
router.post('/goals/edit/:id', ensureAuthenticated, goalController.updateGoal);

router.get('/logs', ensureAuthenticated, logController.getLogs);
router.post('/logs', ensureAuthenticated, logController.addLog);
router.post('/logs/delete/:id', ensureAuthenticated, logController.deleteLog);

router.get('/logs/edit/:id', ensureAuthenticated, logController.editLogForm);
router.post('/logs/edit/:id', ensureAuthenticated, logController.updateLog);

router.get('/logs/stats', ensureAuthenticated, logController.getLogStats);

module.exports = router;
