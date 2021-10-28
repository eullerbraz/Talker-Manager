const fs = require('fs/promises');
const { validatePost, checkToken } = require('../validations/talker');

const FILE_PATH = 'talker.json';
const HTTP_OK_STATUS = 200;
const HTTP_ADD_STATUS = 201;
const HTTP_AUTHORIZATION_FAIL_STATUS = 401;

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
  const editedTalkers = talkers.filter(({ id: talkerId }) => Number(id) !== talkerId);
  talker.name = name;
  talker.age = age;
  talker.talk = talk;
  editedTalkers.push(talker);

  await fs.writeFile(FILE_PATH, JSON.stringify(editedTalkers));

  res.status(HTTP_OK_STATUS).json(talker);
};

const deleteTalker = async (req, res, next) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const tokenTest = checkToken(authorization);

  if (tokenTest) {
    return next({
      message: tokenTest,
      status: HTTP_AUTHORIZATION_FAIL_STATUS,
    });
  }

  const talkers = JSON.parse(await fs.readFile(FILE_PATH));
  const filteredTalkers = talkers.filter(({ id: talkerId }) => Number(id) !== talkerId);

  await fs.writeFile(FILE_PATH, JSON.stringify(filteredTalkers));

  res.status(HTTP_OK_STATUS).json({ message: 'Pessoa palestrante deletada com sucesso' });
};

const searchTalker = async (req, res, next) => {
  const { q } = req.query;
  const { authorization } = req.headers;
  const tokenTest = checkToken(authorization);

  if (tokenTest) {
    return next({
      message: tokenTest,
      status: HTTP_AUTHORIZATION_FAIL_STATUS,
    });
  }

  const talkers = JSON.parse(await fs.readFile(FILE_PATH));
  const filteredTalkers = talkers.filter(({ name }) => name.includes(q));

  await fs.writeFile(FILE_PATH, JSON.stringify(filteredTalkers));

  res.status(HTTP_OK_STATUS).json(filteredTalkers);
};

module.exports = {
  getAllTalkers,
  getTalkerById,
  createTalker,
  editTalker,
  deleteTalker,
  searchTalker,
};
