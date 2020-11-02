const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Curator = require('../model/curator')
const Event = require('../model/event')


const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


const eventController = require('../controllers/eventController')



//get all event curators
router.get('/events', eventController.events_get);


//New curator route
router.get('/events/new', eventController.newEvent_get);


//Create event curator
router.post('/events', eventController.events_post)



module.exports = router;