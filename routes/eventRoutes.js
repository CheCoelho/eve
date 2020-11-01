const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Curator = require('../model/curator')
const Event = require('../model/event')

const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Event.eventImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

const eventController = require('../controllers/eventController')



//get all event curators
router.get('/events', eventController.events_get);


//New curator route
router.get('/events/new', eventController.newEvent_get);


//Create event curator
router.post('/events', upload.single('image'), eventController.events_post)



module.exports = router;