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
const dbURI = 'mongodb+srv://eve_user:TqzuDW3xG9CeuX1r@eve-cluster.ehctd.mongodb.net/eve-db?retryWrites=true&w=majority';

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
const user = require('./model/user');

const curator = require('./model/curator');

const event = require('./model/event')


// app

//view engine
app.set('view engine', 'ejs')


app.set('views,', __dirname + '/views')
app.set('layout', 'layouts/layout')

//Dependency implementation



// The body-parser middleware to parse form data 
app.use(bodyParser.urlencoded({ extended: false }));
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



//Check user data on all routes
app.get('*', checkUser)

app.get('/', (req, res) => res.render('home_index.ejs'));
// app.get('/wallet', requireAuth, (req, res) => res.render('wallet.ejs'))
// app.get('/curators/new', requireAuth, (req, res) => res.render('curators/new.ejs'))
app.get('/transact', requireAuth, (req, res) => res.render('transact.ejs'))
// app.get('/curators', requireAuth, (req, res) => res.render('curators/index.ejs'))
app.get('/profile', requireAuth, (req, res) => res.render('profile.ejs'))
app.get('/update_profile', requireAuth, (req, res) => res.render('update_profile.ejs'))  

//get user specific transaction data for ledger
app.get('/ledger', requireAuth, (req, res) => {
    const transaction_collection = db.collection('transactions')
    transaction_collection.find().toArray(function(err, transaction_list) {
        res.render('ledger.ejs', { 'transactions': transaction_list })
    })
})


//enable routes
app.use(authRoutes);
app.use(curatorRoutes);
app.use(eventRoutes);






app.listen(process.env.PORT || 4000)
