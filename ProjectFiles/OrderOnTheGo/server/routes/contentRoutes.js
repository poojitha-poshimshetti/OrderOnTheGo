const express = require('express')
const router = express.Router()
const contentController = require('../controllers/contentController')
const { protect, admin } = require('../middleware/auth')

// Public routes
router.get('/', contentController.getContent)
router.get('/home', contentController.getHomeContent)

// Admin routes
router.post('/', protect, admin, contentController.createContent)

module.exports = router
