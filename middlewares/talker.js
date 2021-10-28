const fs = require('fs/promises');

const FILE_PATH = 'talker.json';
const HTTP_OK_STATUS = 200;

const getTalkers = async (_req, res) => {
  const talkers = await fs.readFile(FILE_PATH);
  res.status(HTTP_OK_STATUS).json(JSON.parse(talkers));
};

module.exports = {
  getTalkers,
};
