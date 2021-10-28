const express = require('express');

const {
  talker: {
    getAllTalkers,
    getTalkerById,
    createTalker,
  },
} = require('../middlewares');

const router = express.Router();

router.get('/', getAllTalkers);

router.get('/:id', getTalkerById);

router.post('/', createTalker);

module.exports = router;
