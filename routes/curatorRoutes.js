const express = require('express');
const router = express.Router();

const curatorController = require('../controllers/curatorController')

//get all event curators
router.get('/curators', curatorController.curators_get);

//New curator route
router.get('/curators/new', curatorController.newCurators_get);

//create event curator
router.post('/curators', curatorController.curators_post);

//get specific author
router.get('/curators/:id', curatorController.curatorId_get);

//get Edit page specific author
router.get('/curators/:id/edit', curatorController.curatorIdEdit_get);

// Edit  specific author
router.put('/curators/:id', curatorController.curatorIdEdit_put);

// Edit  specific author
router.delete('/curators/:id', curatorController.curatorIdEdit_delete);



module.exports = router;