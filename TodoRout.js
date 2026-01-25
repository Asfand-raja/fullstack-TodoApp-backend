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

router.get('/', getToDo);
router.post('/save', saveToDo);
router.post('/update', updateToDo);
router.post('/delete', deleteToDo);


module.exports = router;
