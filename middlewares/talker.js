const fs = require('fs/promises');

const FILE_PATH = 'talker.json';
const HTTP_OK_STATUS = 200;

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

module.exports = {
  getAllTalkers,
  getTalkerById,
};
