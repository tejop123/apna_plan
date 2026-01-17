const User = require('../models/User');

async function createUser({ name, username, email, hashedPassword, phone = '', role = 'user' }) {
  const user = await User.create({ name, username, email, password: hashedPassword, phone, role });
  return user.toObject();
}

async function findByEmail(email) {
  if (!email) {
    return null;
  }
  return User.findOne({ email: email.toLowerCase() }).lean();
}

async function findByUsername(username) {
  if (!username) {
    return null;
  }
  return User.findOne({ username: username.toLowerCase() }).lean();
}

async function getUser(id) {
  if (!id) {
    return null;
  }
  return User.findById(id).lean();
}

async function updateUser(id, updates = {}) {
  if (!id) {
    return null;
  }
  return User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
}

module.exports = {
  createUser,
  findByEmail,
  findByUsername,
  getUser,
  updateUser
};
