const express = require('express');
const router = express.Router();
const { analyzeEssay, compareWithModel } = require('../controllers/writingController');

// Route cho việc chấm điểm bài viết
router.post('/writing-feedback', analyzeEssay);

// Route cho việc so sánh với bài mẫu
router.post('/compare-with-model', compareWithModel);

module.exports = router;
