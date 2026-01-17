const { getUser, updateUser } = require('../services/userStore');

function safeUser(profile) {
  if (!profile) return null;
  const { password, _id, id, ...rest } = profile;
  return { id: _id ? _id.toString() : id, ...rest };
}

async function getProfile(req, res) {
  const { id } = req.params;
  const profile = await getUser(id);
  if (!profile || (req.user.role !== 'admin' && req.user.id !== profile._id?.toString())) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user: safeUser(profile) });
}

async function updateProfile(req, res) {
  const { id } = req.params;

  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ message: 'You do not have permission to update this profile' });
  }

  const updates = { ...req.body };
  delete updates.password;
  delete updates.role;

  const updated = await updateUser(id, updates);
  if (!updated) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({ user: safeUser(updated) });
}

module.exports = { getProfile, updateProfile };
