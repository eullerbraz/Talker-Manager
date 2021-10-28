const express = require('express');

const { getTalkers } = require('../middlewares/talker');

const router = express.Router();

router.get('/', getTalkers);

module.exports = router;
