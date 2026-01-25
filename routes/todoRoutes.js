const { Router } = require('express');
const {
  getToDo,
  updateToDo,
  saveToDo,
  deleteToDo
} = require('../controllers/ToDoControllers');

const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

// protect all todo routes
router.use(authMiddleware);

router.get('/', getToDo);
router.post('/save', saveToDo);
router.put('/update', updateToDo);   // 🔧 better HTTP method
router.delete('/delete', deleteToDo); // 🔧 better HTTP method

module.exports = router;
