const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    date: {
        type: String,
        default: "Today"
    },
    ongoingDate: {
        type: String,
        default: ""
    },
    lastDate: {
        type: String,
        default: ""
    },
    emoji: {
        type: String,
        default: ""
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for now to avoid breaking existing data, but recommended for dashboard
    }
});

module.exports = mongoose.model('ToDo', ToDoSchema);