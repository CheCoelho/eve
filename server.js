if (process.env.NODE_ENV !== 'production') {                    // Checks whether the app is running in production environment or not. 
    require('dotenv').config()
}

//  Dependencies and related
const express = require('express');                         // integrates express framework 
const app = express();                                     //invokes express to our app var
const expressLayouts = require('express-ejs-layouts');    
const mongoose = require('mongoose') // database
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { check, validationResult } = require('express-validator')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');

//Imported middleware
const { requireAuth, checkUser, checkTransactions } = require('./middleware/authMiddleware')






//Connect to Mongo DB
const dbURI = process.env.dbURI;

mongoose.connect(dbURI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))                       // on error
db.once('open', () => console.log('Connected to Database'))         // on opening



//Port number for local host
const PORT = 4000;






//middleware
app.use(express.json());
app.use (cookieParser());


// Encryption
const bcrypt = require('bcrypt');
const { collection } = require('./model/user');
const User = require('./model/user');

const Curator = require('./model/curator');

const Event = require('./model/event')


// app

//view engine
app.set('view engine', 'ejs')


app.set('views,', __dirname + '/views')
app.set('layout', 'layouts/layout')

//Dependency implementation



// The body-parser middleware to parse form data 
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }));
app.use(bodyParser.json());

app.use(expressLayouts);

app.use(methodOverride('_method '))
app.use(express.static('public'))
app.use(express.json())
app.use(cors());



// routes

//Routers
const authRoutes = require('./routes/authRoutes')
const curatorRoutes = require('./routes/curatorRoutes')
const eventRoutes = require('./routes/eventRoutes')
const homeRoutes= require('./routes/homeRoutes');
const user = require('./model/user');



//Check user data on all routes
app.get('*', checkUser)

//enable routes
app.use(authRoutes);
app.use(curatorRoutes);
app.use(eventRoutes);
app.use(homeRoutes);



//Auth get Routes

//Show profile page
app.get('/profile', requireAuth, (req, res) => {
    
    res.render('profile.ejs');
})

//Show update profile page
app.get('/update_profile', requireAuth, async (req, res) => {
    try {
    //   const user = await User.findById(req.params.id)
    
      res.render('update_profile', { user: user })
    } catch {
      res.redirect('/')
    }
  })

//Event get routes

//Get all events
  app.get('/events', requireAuth, async (req, res) => {
    let query = Event.find()
    if (req.query.event_name != null && req.query.event_name != '') {
        query = query.regex('event_name', new RegExp(req.query.event_name, 'i'))
      }
      if (req.query.event_date != null && req.query.event_date != '') {
        query = query.regex('event_date', new RegExp(req.query.event_date, 'i'))      }
    try {
        const events = await query.exec()
        res.render('events/index', {
            events: events,
            searchOptions : req.query
        })

    } catch {
        res.redirect('/')
    }
})


//New event
app.get('/events/new', requireAuth, async (req, res) => {
    renderNewPage(res, new Event())
})

//Get specific event
app.get('/event/:id', requireAuth, async (req, res) => {
    try {
        console.log(req.params.id)
        const event = await Event.findById(req.params.id)
        .populate('curator')
        .exec();
        console.log(event)
        res.render('events/show', { event: event })
    } catch {
        res.redirect('/')
    }

})


//functions used

//used for event creation
async function renderNewPage(res, event, hasError = false) {

    try {
        const curators = await Curator.find({})
        const params = {
            curators: curators,
            event: event
        }
        if (hasError) params.errorMessage = 'Error Creating Event'
        res.render('events/new', params)

    } catch {
        res.redirect('/events')

    }
}



app.listen(process.env.PORT || 4000)
