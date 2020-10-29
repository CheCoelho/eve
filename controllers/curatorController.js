const User = require('../model/user');

const Curator = require('../model/curator')

const jwt = require('jsonwebtoken');



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


module.exports.curators_get = async (req, res) => {
    let searchOptions = {}
    if (req.query.curator_name != null && req.query.curator_name !== '') {
      searchOptions.curator_name = new RegExp(req.query.curator_name, 'i')
    }
    try {
      const curators = await Curator.find(searchOptions)
      res.render('curators/index', {
        curators: curators,
        searchOptions: req.query
      })
    } catch {
      res.redirect('/')
    }
}


module.exports.newCurators_get = (req, res) => {
    res.render('curators/new', {  curator: new Curator()  });

}




module.exports.curators_post = async (req, res) => {
    const { curator_name,
        description,
        email,
        number_of_events,
        events,
        date

        
         } = req.body;
         try {

            const curator = await Curator.create({ curator_name,
                description,
                email,
                number_of_events,
                events,
                date })
                
             
             
             
            // res.status(201).json( {Curator: Curator._id });
            res.redirect('curators')
            
         } catch (err) {
             const errors = handleErrors(err);
             
         };

};

