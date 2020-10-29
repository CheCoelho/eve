const mongoose = require('mongoose');

const coverImageBasePath = 'uploads/eventImages'



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

    event_image_name: {
        type: String,
        // required: true
    
    }

}, {timestamps: true});






module.exports = mongoose.model('Event', eventSchema); 
module.exports.coverImageBasePath = coverImageBasePath