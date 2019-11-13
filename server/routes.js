const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Chat-app server');
});

module.exports = router;
