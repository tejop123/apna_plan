const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findByEmail, findByUsername } = require('../services/userStore');

function toSafeUser(user) {
  if (!user) return null;
  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
}

function generateToken(user) {
  const safe = toSafeUser(user);
  return jwt.sign(safe, process.env.JWT_SECRET, { expiresIn: '12h' });
}

async function register(req, res, next) {
  try {
    const { name, username, email, password, phone } = req.body;
    const [existingEmail, existingUsername] = await Promise.all([findByEmail(email), findByUsername(username)]);

    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({ name, username, email, hashedPassword, phone });
    const token = generateToken(user);

    return res.status(201).json({ token, user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    return res.json({ token, user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
