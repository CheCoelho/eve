const mongoose = require('mongoose');



const eventSchema = new mongoose.Schema({
    
    event_name: {
        type: String,
        // required: true
        
    },
    
    description: {
        type: String,
        // required: true

    },

    curator:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Curator'


    },
    
    event_date: {
        type: Date,
        // required: true

        
    },

    ticket_price: {
        type: Number,
        // required: true

    },

    event_image: {
        type: Buffer,
        // required: true
    
    },

    event_image_type: {
        type: String,
        // required: true
    },

    location: {
        type: String
    },

    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },

    interested_users: {
        type: Array,
        default: []

    },
    
    attending_users: {
        type: Array,
        default: []


    }

}, {timestamps: true});



eventSchema.virtual('coverImagePath').get(function() {
    if (this.event_image != null && this.event_image_type != null) {
      return `data:${this.event_image_type};charset=utf-8;base64,${this.event_image.toString('base64')}`
    }
  })

module.exports = mongoose.model('Event', eventSchema); 
