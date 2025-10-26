// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = (req, res, next) => {
  res.status(201).json({ success: true, msg: 'User registered' });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = (req, res, next) => {
  res.status(200).json({ success: true, token: 'mock_token' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = (req, res, next) => {
  res.status(200).json({ success: true, data: { /* mock user data */ } });
};
