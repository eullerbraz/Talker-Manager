const HTTP_OK_STATUS = 200;
const HTTP_FAIL_STATUS = 400;

const checkFound = (value) => {
  if (!value || value === '') return false;

  return true;
};

const checkEmailFormat = (email) => {
  const emailRegex = new RegExp('^[a-z0-9.]+@[a-z0-9]+.[a-z]+.([a-z]+)?$', 'i');

  return emailRegex.test(email);
};

const checkPasswordFormat = (password) => {
  if (password.length < 6) return false;

  return true;
};

const validateLogin = (email, password) => {
  const validateObj = {
    errorObj: {
      status: HTTP_FAIL_STATUS,
    },
  };

  if (!checkFound(email)) {
    validateObj.errorObj.message = 'O campo "email" é obrigatório';
  } else if (!checkFound(password)) {
    validateObj.errorObj.message = 'O campo "password" é obrigatório';
  } else if (!checkEmailFormat(email)) {
    validateObj.errorObj.message = 'O "email" deve ter o formato "email@email.com"';
  } else if (!checkPasswordFormat(password)) {
    validateObj.errorObj.message = 'O "password" deve ter pelo menos 6 caracteres';
  } else validateObj.isValid = true;
  
  return validateObj;
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const { isValid, errorObj } = validateLogin(email, password);

  if (!isValid) return next(errorObj);

  res.status(HTTP_OK_STATUS).json({
    token: '7mqaVRXJSp886CGr',
  });
};

module.exports = login;