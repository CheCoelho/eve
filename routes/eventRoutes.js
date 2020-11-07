const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Curator = require('../model/curator')
const Event = require('../model/event')


const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


const eventController = require('../controllers/eventController')



//get all events
// router.get('/events', eventController.events_get);


//New event route
// router.get('/events/new', eventController.newEvent_get);


//Create event 
router.post('/events', eventController.events_post)

// //Get specific event
// router.get('/event/:id', eventController.event_get)



module.exports = router;