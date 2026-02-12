const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Get all news
router.get('/', newsController.getAllNews);

// Create new article
router.post('/', newsController.createNews);

module.exports = router;
