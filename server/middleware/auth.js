const passport = require('passport');

// Protect routes - JWT authentication
exports.protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: err.message
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user has active subscription
exports.requireSubscription = (req, res, next) => {
  if (req.user.accountType === 'demo' && !req.user.isDemoApproved) {
    return res.status(403).json({
      success: false,
      message: 'Demo access pending approval'
    });
  }

  if (req.user.accountType === 'subscriber') {
    if (req.user.subscriptionStatus !== 'active' && req.user.subscriptionStatus !== 'trial') {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required'
      });
    }

    if (req.user.subscriptionEndDate && new Date() > req.user.subscriptionEndDate) {
      return res.status(403).json({
        success: false,
        message: 'Subscription expired'
      });
    }
  }

  next();
};
