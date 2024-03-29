const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
   image:{
    type:String,
    required:true
   },
   location:{
    type:String,
    required:true
   },
});

module.exports = mongoose.model('Campground',campgroundSchema);