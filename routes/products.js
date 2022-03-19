const express= require('express');
const router = express.Router();
const Product = require('../model/Product');
const multer = require('multer');

const fileFilter = function(req, file, cb){
    if(file.mimetype === 'image/jpg'){
        cb(null, true);
    }else {
        cb(new Error('Please Upload jpg File'),false);
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './productImage/')
    },
    filename: function (req, file, cb){
        cb(null, new Date().toDateString()+file.originalname)
    }
})
const upload = multer({
   storage: storage,
    limits: {
       fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

router.get('/',(req, res, next)=> {
   //Get All Products From DB
    Product.find().select('_id name price').
    then(doc=>{
        const response = {
            doc: doc.map(doc=>{
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    url: {
                        type: 'GET',
                        urls: 'localhost:3000/products/'+doc._id
                    }
                }
            })
        }
        res.status(200).json({
            message: response
        })
    }).
    catch(err=>{
       if(err){
           res.status(404).json({
               message:err
           })
       }
    });
});

router.get('/:productId', (req, res, next)=>{
   Product.find({_id: req.params.productId}).
   then(result=>{
       res.status(200).json({
          message: result
       });
    }).
   catch(err=>{
       if(err){
           res.status(404).json({
              message: err
           });
       }
   });
});

router.post('/addproduct',upload.single('myFile'),(req, res, next)=>{
   console.log(req.file);
    const product = new Product({
       name: req.body.name,
       price: req.body.price,
        image: req.file.path
    });
    product.save().
    then(doc=> {
        res.status(200).json({
            message: 'Added Product Successfully!!',
            product: doc
        });
    }).
    catch(err=>{
        if(err){
            res.status(404).json({
               message: err
            });
        }
    });
});

router.patch('/:productId', (req, res, next)=>{
   const newproduct = {
       name: req.body.name,
       price: req.body.price
   }
   Product.update({_id: req.params.productId}, {$set: newproduct}).
   then(doc=>{
       res.status(200).json({
           message: doc
       })
   }).
   catch(err=>{
      if(err){
          res.status(404).json({
             message: err
          });
      }
   });
});

router.delete('/:productId', (req, res, next)=>{
   Product.deleteOne({_id: req.params.productId}).
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




module.exports= router;