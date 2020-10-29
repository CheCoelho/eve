const User = require('../model/user');

const Event = require('../model/event')

const jwt = require('jsonwebtoken');
const Curator = require('../model/curator');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const path = require('path')
const uploadPath = path.join('public', Event.coverImageBasePath)
const multer = require('multer')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }

})



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



//Get all events
module.exports.events_get = (req, res) => {
    
    res.send('All Events')

}

//New event
module.exports.newEvent_get = async (req, res) => {
    renderNewPage(res, new Event())
    

}


//Create event
module.exports.events_post =  async (req, res) => {
   upload.single('image')
    console.log('hi')
    const fileName = req.file != null ? req.file.filename : null
    console.log('hi')

   const {
       event_name,
       description,
       curator,
       event_date,
       ticket_price
       
   } = req.body
   const event_image_name = fileName


         try {

            const event = await Event.create({ 
                event_name,
                description,
                curator,
                event_date,
                ticket_price,
                event_image_name 
                
            })
            console.log(event.event_name)
                
             
             
             
            // res.status(201).json( {Curator: Curator._id });
            res.redirect('events')
            
         } catch (err) {
             const errors = handleErrors(err);
             
         };

}

// const { event_name,
//     description,
//     curator,
//     event_date,
//     ticket_price,
//     event_image_name

    
//      } = req.body;
//      try {

//         const event = await Event.create({ event_name,
//             description,
//             curator,
//             event_date,
//             ticket_price,
//             event_image_name })
            
         
         
         
//         // res.status(201).json( {Curator: Curator._id });
//         res.redirect('events')
        
//      } catch (err) {
//          const errors = handleErrors(err);
         
//      };


// upload.single('image')
//     console.log('hi')
//     const fileName = req.file != null ? req.file.filename : null
//     const event =  Event.create({
//         event_name: req.body.event_name,
//         description: req.body.description,
//         curator: req.body.curator,
//         event_date: req.body.event_date,
//         ticket_price: req.body.ticket_price,
//         event_image_name: fileName
        
        
        
//     })
// console.log(event.event_name)
//     try {
//         const newEvent = await event.save()
//          // res.status(201).json( {Curator: Curator._id });
//          console.log('hello')
        
//          res.redirect('events')
//         } catch  {
//             console.log('1')

//             try {
//                 console.log('1')

//                 const curators = await Curator.find({})
//                 const params = {
//                     curators: curators,
//                     event: event
//                 }
//                 if (hasError) params.errorMessage = 'Error Creating Event'
//                 res.render('events/new', params)
        
//             } catch {
//                 console.log('1')

//                 res.redirect('/events')
        
//             }
//     }

// }

    
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