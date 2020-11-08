const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Transaction = require('../model/curator');
const user = require('../model/user');



const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt

    //check json web token exists and is verrified
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message)
            } else {
                console.log("Auth Successful")
                next();
            }
        })

    } else {
        res.redirect('/login');
    }
}




// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

  // //check transactions
  // const checkTransactions = (req, res, next) => {
  //   if (user.name === await Transaction.find({ payer, receiver }));{
  //     res.locals.transaction = transaction;

    
  //   } else {
  //     console.log('no transactions')
  //   }
  //   next()
  //  }

  //Middleware for getting a user

async function getUser(req, res, next) {
    let user 
    try {
        user = await User.findById(req.params.id)
        if (user === null) {
            return res.status(404).json({ message: 'Cannot find user'}) 
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.user = user
    next()
}

// check spending capacity
const checkSpendingCapacity = (req, res, next) => {
  const token = req.cookies.jwt;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  
  }

module.exports = { requireAuth, checkUser, getUser, checkSpendingCapacity }