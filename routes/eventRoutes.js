const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController')

//get all event curators
router.get('/events', eventController.events_get);


//New curator route
router.get('/events/new', eventController.newEvent_get);


//Create event curator
router.post('/events', eventController.events_post)



module.exports = router;