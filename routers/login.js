const express = require('express');

const {
  login,
} = require('../middlewares');

const router = express.Router();

router.post('/', login);

module.exports = router;
