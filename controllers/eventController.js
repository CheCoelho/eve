const User = require('../model/user');
const Curator = require('../model/curator')
const Event = require('../model/event')

const jwt = require('jsonwebtoken');


const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']






const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { name: '', alias: '', password: '', email: ''};


    //incorrect email

    if (err.message === 'incorrect email') {
        errors.email = 'that email is not registered'
    }
    //incorrect passowrd

    if (err.message === 'Incorrect password') {
       errors.password = 'Incorrect password'
   }
    //duplicate email error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    //alias does not exist for transaction
    if (err.message === 'alias does not exist') {
        errors.alias = "The user you are trying to pay does not exist."
        
    } 

    return errors
}





//New event
module.exports.newEvent_get = async (req, res) => {
    renderNewPage(res, new Event())
    

}


//Create event
module.exports.events_post = async (req, res) => {
   


   

        
   const event = new Event ({
    event_name: req.body.event_name,
    description: req.body.description,
    curator: req.body.curator,
    event_date: req.body.event_date,
    ticket_price: req.body.ticket_price,
   
   }) 


   saveImage(event, req.body.cover)


         try {            
            const newEvent = await event.save()
          
            res.redirect('events')
            
         } catch (err) {
             console.log(err)
           
            //  const errors = handleErrors(err);
             renderNewPage(res, event, true)
             
         };

}


module.exports.event_get= async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        .populate('curator')
        .exec();
        console.log(event)
        res.render('events/show', { event: event })
    } catch {
        res.redirect('/')
    }
}



module.exports.interested_patch = async (req, res) => {

    const token = req.cookies.jwt //get jwt from cookies
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //get user ID from token in jwt
    const userId = decodedToken.id //extract user ID
    
    try {
        const user = await User.findById(userId)
        console.log(user)
    //     const event = await Event.findById(req.params.id)
    //    console.log(event)
    //     event.interested_users.push()
    //    await event.save()
    //    res.status(201);

    } catch (err) {
        console.log(err)
        res.send(err)
    }
    
 }





//Used Functions

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


function saveImage(event, coverEncoded) {
    if (coverEncoded == null) {
        console.log('fail')
        return
    } 
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        event.event_image = new Buffer.from(cover.data, 'base64')
        event.event_image_type = cover.type
    } else {
        console.log("error with type")
    }
}
