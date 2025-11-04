const express = require('express');
const router = express.Router();
const { getPreferences, updatePreferences } = require('../controllers/preferencesController');

router.route('/')
  .get(getPreferences)
  .put(updatePreferences);

module.exports = router;
