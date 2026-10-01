const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  sendSuccess(res, 201, 'User registered successfully', { user });
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  sendSuccess(res, 200, 'Login successful', { user, accessToken, refreshToken });
});

const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Profile fetched successfully', { user: req.user });
});

const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refresh(req.body.refreshToken);
  sendSuccess(res, 200, 'Token refreshed', tokens);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user);
  sendSuccess(res, 200, 'Logged out successfully');
});

module.exports = { register, login, getProfile, refresh, logout };
