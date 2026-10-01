const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken } = require('../utils/token');
const { sendWelcomeEmail } = require('./email.service');

const issueTokens = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = hashToken(refreshToken);
  await user.save();
  return { accessToken, refreshToken };
};

const register = async ({ username, email, password, phone }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed, phone });

  // Don't fail registration if the email can't be sent
  sendWelcomeEmail(user).catch((err) => console.error('Welcome email failed:', err.message));

  return user; // toJSON strips the password
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +refreshToken');
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const tokens = await issueTokens(user);
  return { user, ...tokens };
};

const refresh = async (token) => {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(payload.sub).select('+refreshToken');
  if (!user || user.refreshToken !== hashToken(token)) throw new ApiError(401, 'Refresh token revoked');

  return issueTokens(user); // rotate: old refresh token stops working
};

const logout = async (user) => {
  user.refreshToken = undefined;
  await user.save();
};

module.exports = { register, login, refresh, logout };
