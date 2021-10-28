const express = require('express');

const {
  talker: {
    getAllTalkers,
    getTalkerById,
    createTalker,
    editTalker,
    deleteTalker,
  },
} = require('../middlewares');

const router = express.Router();

router.get('/', getAllTalkers);

router.get('/:id', getTalkerById);

router.post('/', createTalker);

router.put('/:id', editTalker);

router.delete('/:id', deleteTalker);

module.exports = router;
