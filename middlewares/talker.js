const fs = require('fs/promises');

const FILE_PATH = 'talker.json';
const HTTP_OK_STATUS = 200;
const HTTP_ADD_STATUS = 201;
const HTTP_FAIL_STATUS = 400;
const HTTP_AUTHORIZATION_FAIL_STATUS = 401;

const checkFound = (value) => {
  if (!value || value === '') return false;

  return true;
};

const checkToken = (authorization) => {
  if (!checkFound(authorization)) {
    return 'Token não encontrado';
  }

  if (typeof authorization !== 'string' || authorization.length !== 16) {
    return 'Token inválido';
  }

  return false;
};

const checkName = (name) => {
  if (!checkFound(name)) {
    return 'O campo "name" é obrigatório';
  }

  if (typeof name !== 'string' || name.length < 3) {
    return 'O "name" deve ter pelo menos 3 caracteres';
  }

  return false;
};

const checkAge = (age) => {
  if (typeof age !== 'number' || !checkFound(age)) {
    return 'O campo "age" é obrigatório';
  }

  if (age < 18) {
    return 'A pessoa palestrante deve ser maior de idade';
  }

  return false;
};

const checkWatchedAt = (watchedAt) => {
  if (!checkFound(watchedAt)) {
    return 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios';
  }

  const regexDate = RegExp(
    '^([0][1-9]|[1|2][0-9]|[3][0|1])[./]([0][1-9]|[1][0-2])[./]([0-9]{4}|[0-9]{2})$',
  );

  if (typeof watchedAt !== 'string' || !regexDate.test(watchedAt)) {
    return 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
  }

  return false;
};

const checkRate = (rate) => {
  if (typeof rate !== 'number') {
    return 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios';
  }

  if (rate < 1 || rate > 5) {
    return 'O campo "rate" deve ser um inteiro de 1 à 5';
  }

  return false;
};

const checkTalk = (talk) => {  
  if (!checkFound(talk) || typeof talk !== 'object') {
    return 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios';
  }

  const { watchedAt, rate } = talk;
  const watchedTest = checkWatchedAt(watchedAt);
  const RateTest = checkRate(rate);

  if (watchedTest) {
    return watchedTest;
  }

  if (RateTest) {
    return RateTest;
  }

  return false;
};

const validatePost = (token, name, age, talk) => {  
  const tokenTest = checkToken(token);
  const nameTest = checkName(name);
  const ageTest = checkAge(age);
  const talkTest = checkTalk(talk);
  const validateObj = { errorObj: { status: HTTP_FAIL_STATUS }, isValid: false };

  if (tokenTest) {
    validateObj.errorObj.message = tokenTest;
    validateObj.errorObj.status = HTTP_AUTHORIZATION_FAIL_STATUS;
  } else if (nameTest) {
    validateObj.errorObj.message = nameTest;
  } else if (ageTest) {
    validateObj.errorObj.message = ageTest;
  } else if (talkTest) {
    validateObj.errorObj.message = talkTest;
  } else validateObj.isValid = true;
  
  return validateObj;
};

const getAllTalkers = async (_req, res) => {
  const talkers = JSON.parse(await fs.readFile(FILE_PATH));
  res.status(HTTP_OK_STATUS).json(talkers);
};

const getTalkerById = async (req, res, next) => {
  const { id } = req.params;
  const talkers = JSON.parse(await fs.readFile(FILE_PATH));
  const talker = talkers
    .find(({ id: talkerId }) => Number(id) === talkerId);
  
  if (!talker) {
    return next({
      status: 404,
      message: 'Pessoa palestrante não encontrada',
    });
  }
  res.status(HTTP_OK_STATUS).json(talker);
};

const createTalker = async (req, res, next) => {
  const { authorization } = req.headers; 
  const { name, age, talk } = req.body;
  const { isValid, errorObj } = validatePost(authorization, name, age, talk);

  if (!isValid) return next(errorObj);

  const talkers = JSON.parse(await fs.readFile(FILE_PATH));
  const talker = {
    name,
    age,
    id: talkers.length + 1,
    talk,
  };
  talkers.push(talker);

  await fs.writeFile(FILE_PATH, JSON.stringify(talkers));

  res.status(HTTP_ADD_STATUS).json(talker);
};

const editTalker = async (req, res, next) => {
  const { id } = req.params;
  const { authorization } = req.headers; 
  const { name, age, talk } = req.body;
  const { isValid, errorObj } = validatePost(authorization, name, age, talk);

  if (!isValid) return next(errorObj);

  const talkers = JSON.parse(await fs.readFile(FILE_PATH));
  const talker = talkers.find(({ id: talkerId }) => Number(id) === talkerId);
  const editedTalkers = talkers.filter(({ talkerId }) => Number(id) !== talkerId);
  talker.name = name;
  talker.age = age;
  talker.talk = talk;
  editedTalkers.push(talker);

  await fs.writeFile(FILE_PATH, JSON.stringify(talkers));

  res.status(HTTP_OK_STATUS).json(talker);
};

module.exports = {
  getAllTalkers,
  getTalkerById,
  createTalker,
  editTalker,
};
