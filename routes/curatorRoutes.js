const express = require('express');
const router = express.Router();

const curatorController = require('../controllers/curatorController')

//get all event curators
router.get('/curators', curatorController.curators_get);


//New curator route
router.get('/curators/new', curatorController.newCurators_get);


//create event curator
router.post('/curators', curatorController.curators_post)



module.exports = router;