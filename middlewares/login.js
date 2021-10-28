const { validateLogin } = require('../validations/login');

const HTTP_OK_STATUS = 200;

const login = (req, res, next) => {
  const { email, password } = req.body;

  const { isValid, errorObj } = validateLogin(email, password);

  if (!isValid) return next(errorObj);

  res.status(HTTP_OK_STATUS).json({
    token: '7mqaVRXJSp886CGr',
  });
};

module.exports = login;