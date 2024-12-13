const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpired: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
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
userSchema.pre('save', async function (next) {
  //!only run if passowrd was actually modified modified
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // as sve methods takes some time so we reduce it by one sec.
  next();
});
userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//Instance method is avaliable for all documents.

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return jwtTimestamp < changeTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('users', userSchema);

module.exports = User;
