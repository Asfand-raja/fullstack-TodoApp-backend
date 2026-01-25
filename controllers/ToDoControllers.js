const ToDoModel = require('../Models/ToDoModel');

/* -------------------- GET TODOS -------------------- */
module.exports.getToDo = async (req, res) => {
  try {
    const todos = await ToDoModel.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------- SAVE TODO -------------------- */
module.exports.saveToDo = async (req, res) => {
  try {
    const { text, date, ongoingDate, lastDate, emoji, priority } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const todo = await ToDoModel.create({
      text,
      date,
      ongoingDate,
      lastDate,
      emoji,
      priority,
      user: req.user.id
    });

    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------- UPDATE TODO -------------------- */
module.exports.updateToDo = async (req, res) => {
  try {
    const { id, ...updates } = req.body;

    const updated = await ToDoModel.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updates,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------- DELETE TODO -------------------- */
module.exports.deleteToDo = async (req, res) => {
  try {
    const { id } = req.body;

    const deleted = await ToDoModel.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
