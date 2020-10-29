const User = require('../model/user');
const Transaction = require('../model/curator');

const jwt = require('jsonwebtoken');

const user = require('../model/user');









//handle error
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


//create token

const maxAge = 1*60*60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: maxAge
    })
}


//load register page
module.exports.register_get = (req, res) => {
    res.render('register');

}


//load login page
module.exports.login_get = (req, res) => {
    res.render('login');

}

//register user and log them in
module.exports.register_post = async (req, res) => {
    
    const { name, 
        alias, 
        password, 
        email, 
        creditLimit, 
        currentBalance, 
        totalSpent, 
        totalEarned, 
        participation, 
        spendingCapacity } = req.body;
   
    try {

       const user = await User.create({ name, 
        alias, 
        password, 
        email, 
        creditLimit, 
        currentBalance, 
        totalSpent, 
        totalEarned, 
        participation, 
        spendingCapacity })
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        
       res.status(201).json( {user: user._id });
       
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }

}

// log in already registered user
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}


//logout user
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })                // replaces jwt with another that expires in 1 ms, as a work around to directly deleting the jw
    res.redirect('/');
}

module.exports.profile_get = (req, res) => {
    
    res.redirect('/profile');
}




//show transaction page
module.exports.transact_get = (req, res) => {
    res.render('transact');

}

//make payment
module.exports.transact_patch =  async (req, res) => {
    const { alias, amount, reference } = req.body;
    const payment = parseInt(amount, 10); 
    const token = req.cookies.jwt //get jwt from cookies
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //get user ID from token in jwt
    const userId = decodedToken.id //extract user ID

    try {
    const beneficiary = await User.transact(alias); //send credits to the beneficiary 
    const user = await User.findById(userId);

    
    

     if (payment <= user.spendingCapacity ) {
             console.log(user.spendingCapacity  -payment)
    
    try { 

        beneficiary.currentBalance += payment;
        beneficiary.totalEarned += payment;
        beneficiary.participation += payment;
        beneficiary.spendingCapacity += payment;

        if (beneficiary.peers.includes(user.name)) {
            
        } else {
            beneficiary.peers.push(user.name)
        };
        
        beneficiary.transaction_count += 1; 
        await beneficiary.save()

        user.currentBalance -= payment;
        user.totalSpent += payment;
        user.participation += payment;
        user.spendingCapacity -= payment;

        if (user.peers.includes(beneficiary.name)) {            //if user does not exist, then add it to the user and beneficieries list of peers
            
        } else {
            user.peers.push(beneficiary.name)
        }

        
        //create transaction in db
        const payer = user.name;
        const receiver = beneficiary.name;
        const payment_amount = payment;
        const note = reference;

        try {

           await Transaction.create({ 
                payer,
                receiver,
                payment_amount,
                note }) 

         } catch (err) {
             const errors = handleErrors(err);
             
         }

        user.transaction_count += 1; 

        await user.save()
       
        console.log(beneficiary); //for development
        console.log(user);  //for development
        
        res.status(200).json({ beneficiary: beneficiary._id });
        // } else {
        //     return
        // }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
    console.log
    }
else {
    res.send("Insufficient spending capacity")
    // res.redirect('/transact')
    }

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        
    }
}

//Show update profile page
module.exports.update_get =  async (req, res) => {
    try {
    //   const user = await User.findById(req.params.id)
      res.render('update_profile', { user: user })
    } catch {
      res.redirect('/')
    }
  }
  

//Update Profile
module.exports.update_patch =  async  (req, res) => {
    
    const token = req.cookies.jwt //get jwt from cookies
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //get user ID from token in jwt

    try {

       const userId = decodedToken.id
       const user = await User.findById(userId)
        // console.log(user)

            if (req.body.name != '') {
                user.name = req.body.name
            } else {
                user.name = user.name
            }
            if (req.body.alias != '') {
                user.alias = req.body.alias
            } else {
                user.alias = user.alias
            }
            if (req.body.password != '') {
                user.password = req.body.password
            } else {
                user.password = user.password
            }
            

            await user.save()

            res.status(200).json(userId)

            // console.log(user)



    } catch (err) {
        console.log(err)
    }

}

module.exports.user_delete = async (req, res) => {
    
    
    const token = req.cookies.jwt //get jwt from cookies
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) //get user ID from token in jwt

    try {

       const userId = decodedToken.id
       const user = await User.findByIdAndRemove(userId)
       res.status(200).json(200)

       

    } catch {

    }

    
    
     
 }

module.exports.ledger_get = async (req, res) => {

    const userTransactions = await User.get_transactions
    res.send(userTransactions)
     
 }

module.exports.ledger_post = async (req, res) => {

   const userTransactions = await User.get_transactions
   res.send(userTransactions)
    
}
