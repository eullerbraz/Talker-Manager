const express = require('express');

const {
  talker: {
    getAllTalkers,
    getTalkerById,
  },
} = require('../middlewares');

const router = express.Router();

router.get('/', getAllTalkers);

router.get('/:id', getTalkerById);

module.exports = router;
