const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your eamil.'],
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid Email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, //This line will hide password property from response.
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a confirm password.'],
    validate: {
      //!this only works on CREATE and SAVE.!!!!!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Please enter same passwords.',
    },
  },
  photo: String,
});

userSchema.pre('save', async function (next) {
  //!only run if passowrd was actually modified modified
  if (!this.isModified('password')) return next();

  //hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //!delete passwordConfirm Field.
  this.passwordConfirm = undefined;
  next();
});

//Instance method is avaliable for all documents.

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('users', userSchema);

module.exports = User;