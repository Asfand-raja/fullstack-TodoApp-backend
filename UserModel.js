const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true, // removes extra spaces
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // normalize email
        trim: true,
    },
    password: {
        type: String,
        required: false, // optional for social login users
    },
    googleId: {
        type: String,
    },
    appleId: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
    }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// Method to compare password for login
UserSchema.methods.comparePassword = async function (enteredPassword) {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
