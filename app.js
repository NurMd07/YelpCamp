const express = require('express');
      app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds');
const catchAsync = require('./utils/catchAsync.js')
const validUrl = require('valid-url');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/?retryWrites=true&w=majority',{dbName:'yelpcamp'})
     .then(()=>{
        console.log('Connected to DB');
     })
     .catch((err)=>{
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
     });

app.engine('ejs',ejsMate);   
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'Public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds',catchAsync(async(req,res,next)=>{
  let campgrounds = await Campground.find({});
    res.render('campground/index',{campgrounds});
}));

app.post('/campgrounds',catchAsync(async(req,res,next)=>{
  if (!validUrl.isUri(req.body.campground.image)){
    res.status(400).send('Invalid url');
   throw new Error('invalid-url');
} 
  let newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

app.get('/campgrounds/new',(req,res)=>{
     res.render('campground/new');
});

app.get('/campgrounds/:id',catchAsync(async(req,res,next)=>{
        let camp = await Campground.findById(req.params.id);
        res.render('campground/show',{camp});
}));

app.get('/campgrounds/:id/edit',catchAsync(async(req,res,next)=>{
   let {id} = req.params;
   let camp = await Campground.findById(id);
   res.render('campground/edit',{camp});
}));

app.delete('/campgrounds/:id',catchAsync(async(req,res,next)=>{
  let {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.put('/campgrounds/:id',catchAsync(async(req,res,next)=>{
  let {id} = req.params;
    let updatedCamp = req.body.campground;
    if (!validUrl.isUri(req.body.campground.image)){
      res.status(400).send('Invalid url');
     throw new Error('invalid-url');
  } 
    await Campground.findByIdAndUpdate(id,updatedCamp);
    res.redirect(`/campgrounds/${id}`);
}));


app.use((err,req,res,next)=>{
  console.log(err);
    res.send('something went wrong!');
});

app.listen(8000, () => {
    console.log("Server is Started..")
});