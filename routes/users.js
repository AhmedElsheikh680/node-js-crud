var express = require('express');
var router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//Signup
router.post('/signup',(req, res, next)=> {
  User.find({username: req.body.username}).then(result=>{ //check user exist ib db
    if(result.length <1){ // user unique
      bcrypt.hash(req.body.password, 10, (err, hash)=> { // hashed password
        if(err) {
          res.status(404).json({
            message: err
          });
        }else {
          const user = new User({
            username: req.body.username,
            password: hash
          });
          user.save().then(result=>{
            console.log(result);
            res.status(200).json({
              messsage: "User Already Created"
            })
          }).catch(err=>{
            res.status(404).json({
              message: err
            })
          });
        }
      });
    }else {
      res.status(404).json({
        message: 'User Already Exists!!'
      })
    }
  }).catch(err=>{
    res.status(404).json({
      message: err
    })
  });


});

//Signin
router.get('/signin', (req, res, next)=> {
  User.find({username: req.body.username}).then(user=>{ //Get User
    if(user.length >=1) { //check if user exist in db
      bcrypt.compare(req.body.password, user[0].password). // compare new pass with old pass
      then(result=>{
        if(result) {
          res.status(200).json({
            message: "Success Signin"
          })
        }else {
          res.status(404).json({
            message: "Wrong Password"

          });
        }
      }).catch(err=>{
        if(err) {
          res.status(404).json({
            message: err
          });
        }
      });
    }else {
      res.status(404).json({
        message: "Wrong Username"
      })
    }
  }).catch(err=>{
    if(err){
      res.status(404).json({
        message: err
      })
    }
  });
});

//UpdateUser
router.patch('/updateUser/:id', (req, res, next)=>{
  bcrypt.hash(req.body.password, 10).
  then(hash=>{
    const newuser = {
      username: req.body.username,
      password: hash
    }
    User.findOneAndUpdate({_id: req.params.id}, {$set: newuser}).
    then(result=> {
      if(result) {
        res.status(202).json({
          messaage: "User Already Updated"
        });
      }else {
        res.status(404).json({
          message: "User Not Found"
        })
      }

    }).
    catch(err=>{
      if(err) {
        res.status(404).json({
          message: err
        });
      }
    });
  }).
  catch(err=> {
    if(err) {
      res.status(404).json({
        message: err
      });
    }
  })

});

//deleteUser
router.delete('/deleteUser/:id', (req, res, next)=> {
  User.findOneAndDelete({_id: req.params.id}).
  then(result=>{
    if(result) {
      res.status(200).json({
        message: "User Deleted Successfully!!"
      });
    }else {
      res.status(404).json({
        message: "User Not Found"
      });
    }

  }).
  catch(err=>{
    if(err) {
      res.status(404).json({
        message: err
      });
    }
  });
})


module.exports = router;
