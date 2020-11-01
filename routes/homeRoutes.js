const express = require('express')
const router = express.Router()
const Event = require('../model/event')

router.get('/', async (req, res) => {
  let events
  try {
    events = await Event.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    events = []
  }
  res.render('home_index', { events: events })
})

module.exports = router