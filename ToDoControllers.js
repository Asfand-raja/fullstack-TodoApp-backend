const ToDoModel = require('../Models/ToDoModel');

// GET user-specific todos
module.exports.getToDo = async (req, res) => {
  try {
    const toDos = await ToDoModel.find({ user: req.user.id });
    res.status(200).json(toDos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SAVE a new todo for the logged-in user
module.exports.saveToDo = async (req, res) => {
  try {
    const { text, date, ongoingDate, lastDate, emoji, priority } = req.body;
    const userId = req.user.id;

    const data = await ToDoModel.create({ text, date, ongoingDate, lastDate, emoji, priority, user: userId });

    console.log('Added Successfully...');
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.updateToDo = async (req, res) => {
  const { id, text, completed, date, ongoingDate, lastDate, emoji, priority } = req.body;
  const userId = req.user.id;

  // Ensure the todo belongs to the user
  ToDoModel
    .findOneAndUpdate({ _id: id, user: userId }, { text, completed, date, ongoingDate, lastDate, emoji, priority })
    .then(() => res.send('Updated Successfully...'))
    .catch((err) => res.status(500).json({ message: err.message }));

}

module.exports.deleteToDo = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  // Ensure the todo belongs to the user
  ToDoModel
    .findOneAndDelete({ _id: id, user: userId })
    .then(() => res.send('Deleted Successfully...'))
    .catch((err) => res.status(500).json({ message: err.message }));
}

