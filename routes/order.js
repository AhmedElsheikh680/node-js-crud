const express = require('express');
const router = express.Router();
const Order = require('../model/Order');

router.post('/addOrder', (req, res, next)=>{
   const newOrder = new Order({
      user: req.body.user,
       product: req.body.product
   });
   newOrder.save().
   then(doc=>{
       res.status(200).json({
           message: doc
       })
   }).
   catch(err=>{
      if(err){
          res.status(404).json({
              message: err
          })
      }
   });
});

router.get('/',(req, res,next)=>{
    Order.find().populate('user', 'username').
    then(doc=>{
        res.status(200).json({
            message: doc
        })
    }).
    catch(err=>{
       if(err){
           res.status(404).json({
               message: err
           })
       }
    });
});

router.patch('/updateOrder/:orderId', (req, res, next)=>{
    const newProduct  = req.body.product;
    console.log(newProduct);
   Order.find({_id: req.params.orderId}).
   then(doc=>{
       var oldProduct = doc[0].product;
       for(var indexOfNewProduct=0; indexOfNewProduct< newProduct.length; indexOfNewProduct++){
           for(var indexOfOldProduct=0; indexOfOldProduct<oldProduct.length; indexOfOldProduct++){
               if(newProduct[indexOfNewProduct]._id === oldProduct[indexOfOldProduct]._id){
                   oldProduct[indexOfOldProduct].quantity = Number(oldProduct[indexOfOldProduct].quantity)+
                       Number(newProduct[indexOfNewProduct].quantity);
                   newProduct.splice(indexOfNewProduct,1);
                   break;
               }
           }
       }
        oldProduct = oldProduct.concat(newProduct);
       console.log(oldProduct);
       const newOrder = {
           product: oldProduct
       }
       Order.update({_id: req.params.orderId}, {$set: newOrder}).
       then(doc=>{
           res.status(200).json({
               message: doc
           })
       }).
       catch(err=>{
           if(err){
               res.status(404).json({
                   message: err
               })
           }
       })
       res.status(200).json({
           message: doc[0].product
       })
   }).
   catch(err=>{
      if(err) {
          res.status(404).json({
             message: err
          });
      }
   });
});


router.delete('/:deleteOrder', (req, res,next)=>{
   Order.deleteOne({_id: req.params.deleteOrder}).
   then(doc=>{
       res.status(200).json({
           message: "Delete Successfully!!"
       })
   }).
   catch(err=>{
      if(err){
          res.status(404).json({
              message: err
          })
      }
   });
});
























module.exports = router;