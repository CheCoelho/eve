const mongoose = require('mongoose');



const curatorSchema = new mongoose.Schema({
    
    curator_name: {
        type: String,
        required: true
        
    },
    
    description: {
        type: String
    },

    email:{
        type: String
    },
    
    number_of_events: {
        type: Number,
        default: 0
    },

    events: {
        type: Array
    },

    date: {
        type: Date
    
    }

}, {timestamps: true});






module.exports = mongoose.model('Curator', curatorSchema); 