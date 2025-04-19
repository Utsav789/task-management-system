import mongoose from 'mongoose';

// Creating a user structure for task management system.
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    lowercase: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  dob: {
    type: Date,
    max: Date.now(),
    required: false,
  },
  gender: {
    type: String,
    trim: true,
    required: true,
    enum: ['male', 'female', 'other'],
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
});

// create table/model for tms
const UserTable = mongoose.model('User', userSchema);

export default UserTable;