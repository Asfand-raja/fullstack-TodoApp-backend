const { Router } = require('express');
const {
  getToDo,
  updateToDo,
  saveToDo,
  deleteToDo
} = require('../controllers/ToDoControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

// Apply authMiddleware to all todo routes
router.use(authMiddleware);

// GET all todos for the logged-in user
router.get('/', getToDo);

// CREATE a new todo
router.post('/save', saveToDo);

// UPDATE an existing todo
router.post('/update', updateToDo);

// DELETE a todo
router.post('/delete', deleteToDo);

module.exports = router;
