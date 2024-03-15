const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const cities = require('./cities');
const { descriptors , places } = require('./seedHelpers');
const description = require('./description')


mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/?retryWrites=true&w=majority',{dbName:'yelpcamp'})
     .then(()=>{
        console.log('Connected to DB');
     })
     .catch((err)=>{
        console.log(err);
     });

const names = array => array[Math.floor(Math.random()* array.length)];

const seedDB = async ()=>{
    await Campground.deleteMany({});
    console.log('Cleared all campgrounds');
   for(let i=1;i<9;i++){
    let randomCity = Math.floor(Math.random()*1000);
    let price = Math.floor(Math.random()*20)+10;
  let campground = new Campground({
    location:`${cities[randomCity].city},${cities[randomCity].state}`,
    name:`${names(descriptors)} ${names(places)}`,
    image:`/temp/${i}.jpg`,
    description:`${description[i-1]}`,
    price:price
   });
   await campground.save();
   }
}

seedDB().then(()=>{
    mongoose.connection.close();
});